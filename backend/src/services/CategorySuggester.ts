import { query } from '../utils/db.js';
import { merchantKeywords } from '../utils/email-patterns.js';

interface CategorySuggestion {
  id: number;
  name: string;
  frequency: number;
  confidence: number;
}

interface SubcategorySuggestion {
  id: number;
  name: string;
  frequency: number;
}

export class CategorySuggester {
  // Levenshtein distance for fuzzy matching
  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = a[j - 1] === b[i - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    return matrix[b.length][a.length];
  }

  // Find similar descriptions in transaction history
  private async findSimilarTransactions(
    userId: number,
    description: string,
    threshold: number = 3
  ): Promise<number[]> {
    const result = await query(
      `SELECT id, description FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [userId]
    );

    const similar: number[] = [];
    const descLower = description.toLowerCase();

    for (const row of result.rows) {
      const dist = this.levenshteinDistance(descLower, row.description.toLowerCase());
      // Also check for substring match (merchant keywords)
      const isSubstring = descLower.includes(row.description.toLowerCase()) ||
        row.description.toLowerCase().includes(descLower);

      if (dist <= threshold || isSubstring) {
        similar.push(row.id);
      }
    }
    return similar;
  }

  // Get category suggestions based on description
  async suggestCategories(
    userId: number,
    description: string,
    limit: number = 3
  ): Promise<CategorySuggestion[]> {
    const descLower = description.toLowerCase();

    // Find similar transactions
    const similarTxnIds = await this.findSimilarTransactions(userId, description);

    if (similarTxnIds.length === 0) {
      // Fallback: try keyword matching against merchant keywords
      return this.suggestByKeywords(userId, descLower, limit);
    }

    // Get category frequencies from similar transactions
    const placeholders = similarTxnIds.map((_, i) => `$${i + 2}`).join(',');
    const result = await query(
      `SELECT
        c.id, c.name,
        COUNT(*) as frequency
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1 AND t.id IN (${placeholders})
      GROUP BY c.id, c.name
      ORDER BY frequency DESC
      LIMIT $${similarTxnIds.length + 2}`,
      [userId, ...similarTxnIds, limit]
    );

    return result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      frequency: parseInt(row.frequency),
      confidence: 0.8,
    }));
  }

  // Suggest categories based on keyword matching
  private async suggestByKeywords(
    userId: number,
    description: string,
    limit: number = 3
  ): Promise<CategorySuggestion[]> {
    const categoryScores: Record<string, number> = {};

    // Score categories based on keyword matches
    for (const [category, keywords] of Object.entries(merchantKeywords)) {
      for (const keyword of keywords) {
        if (description.includes(keyword)) {
          categoryScores[category] = (categoryScores[category] || 0) + 1;
        }
      }
    }

    // Get user's categories and combine with scores
    const result = await query(
      `SELECT id, name FROM categories WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    const suggestions = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      frequency: categoryScores[row.name] || 0,
      confidence: categoryScores[row.name] ? 0.6 : 0.3,
    }));

    return suggestions
      .filter((s) => s.frequency > 0)
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);
  }

  // Get valid subcategories for a category
  async getSubcategoriesForCategory(
    categoryId: number,
    userId: number
  ): Promise<SubcategorySuggestion[]> {
    const result = await query(
      `SELECT
        s.id, s.name,
        COUNT(t.id) as frequency
      FROM subcategories s
      LEFT JOIN transactions t ON t.subcategory_id = s.id AND t.user_id = $2
      WHERE s.category_id = $1 AND s.user_id IS NULL OR s.user_id = $2
      GROUP BY s.id, s.name
      ORDER BY frequency DESC`,
      [categoryId, userId]
    );

    return result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      frequency: parseInt(row.frequency),
    }));
  }

  // Suggest subcategories based on history
  async suggestSubcategories(
    userId: number,
    categoryId: number,
    limit: number = 5
  ): Promise<SubcategorySuggestion[]> {
    const suggestions = await this.getSubcategoriesForCategory(categoryId, userId);
    return suggestions.slice(0, limit);
  }
}
