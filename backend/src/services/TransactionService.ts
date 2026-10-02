import { query } from '../utils/db.js';

export interface Transaction {
  id: number;
  user_id: number;
  description: string;
  amount: number;
  currency: string;
  mode_of_payment: string;
  bank_account_id?: number;
  category_id: number;
  subcategory_id?: number;
  source: string;
  transaction_date: Date;
  created_at: Date;
  updated_at: Date;
}

export class TransactionService {
  async createTransaction(
    userId: number,
    data: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<Transaction> {
    const result = await query(
      `INSERT INTO transactions (
        user_id, description, amount, currency, mode_of_payment,
        bank_account_id, category_id, subcategory_id, source, transaction_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        userId,
        data.description,
        data.amount,
        data.currency,
        data.mode_of_payment,
        data.bank_account_id,
        data.category_id,
        data.subcategory_id,
        data.source,
        data.transaction_date,
      ]
    );
    return result.rows[0];
  }

  async getTransactions(
    userId: number,
    filters?: {
      from?: Date;
      to?: Date;
      categoryId?: number;
      modeOfPayment?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<Transaction[]> {
    let query_str = `SELECT * FROM transactions WHERE user_id = $1`;
    const params: any[] = [userId];
    let paramIndex = 2;

    if (filters?.from) {
      query_str += ` AND transaction_date >= $${paramIndex}`;
      params.push(filters.from);
      paramIndex++;
    }
    if (filters?.to) {
      query_str += ` AND transaction_date <= $${paramIndex}`;
      params.push(filters.to);
      paramIndex++;
    }
    if (filters?.categoryId) {
      query_str += ` AND category_id = $${paramIndex}`;
      params.push(filters.categoryId);
      paramIndex++;
    }
    if (filters?.modeOfPayment) {
      query_str += ` AND mode_of_payment = $${paramIndex}`;
      params.push(filters.modeOfPayment);
      paramIndex++;
    }

    query_str += ` ORDER BY transaction_date DESC`;

    if (filters?.limit) {
      query_str += ` LIMIT $${paramIndex}`;
      params.push(filters.limit);
      paramIndex++;
    }
    if (filters?.offset) {
      query_str += ` OFFSET $${paramIndex}`;
      params.push(filters.offset);
    }

    const result = await query(query_str, params);
    return result.rows;
  }

  async getTransactionById(userId: number, transactionId: number): Promise<Transaction | null> {
    const result = await query(
      `SELECT * FROM transactions WHERE id = $1 AND user_id = $2`,
      [transactionId, userId]
    );
    return result.rows.length ? result.rows[0] : null;
  }

  async updateTransaction(
    userId: number,
    transactionId: number,
    data: Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at'>>
  ): Promise<Transaction | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fields.length === 0) return this.getTransactionById(userId, transactionId);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(transactionId, userId);

    const query_str = `UPDATE transactions SET ${fields.join(', ')}
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      RETURNING *`;

    const result = await query(query_str, values);
    return result.rows.length ? result.rows[0] : null;
  }

  async deleteTransaction(userId: number, transactionId: number): Promise<boolean> {
    const result = await query(
      `DELETE FROM transactions WHERE id = $1 AND user_id = $2`,
      [transactionId, userId]
    );
    return (result.rowCount ?? 0) > 0;
  }

  // Analytics
  async getSpendingByCategory(userId: number, from?: Date, to?: Date) {
    let query_str = `SELECT
      c.id, c.name, c.color,
      SUM(t.amount) as total,
      COUNT(t.id) as count
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = $1`;
    const params: any[] = [userId];

    if (from) {
      query_str += ` AND t.transaction_date >= $2`;
      params.push(from);
    }
    if (to) {
      query_str += ` AND t.transaction_date <= $3`;
      params.push(to);
    }

    query_str += ` GROUP BY c.id, c.name, c.color ORDER BY total DESC`;

    const result = await query(query_str, params);
    return result.rows;
  }

  async getSpendingTrend(userId: number, days: number = 30) {
    const result = await query(
      `SELECT
        DATE(transaction_date) as date,
        SUM(amount) as total,
        COUNT(id) as count
      FROM transactions
      WHERE user_id = $1 AND transaction_date >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY DATE(transaction_date)
      ORDER BY date ASC`,
      [userId]
    );
    return result.rows;
  }

  async getPaymentModeBreakdown(userId: number, from?: Date, to?: Date) {
    let query_str = `SELECT
      mode_of_payment,
      SUM(amount) as total,
      COUNT(id) as count
    FROM transactions
    WHERE user_id = $1`;
    const params: any[] = [userId];

    if (from) {
      query_str += ` AND transaction_date >= $2`;
      params.push(from);
    }
    if (to) {
      query_str += ` AND transaction_date <= $3`;
      params.push(to);
    }

    query_str += ` GROUP BY mode_of_payment ORDER BY total DESC`;

    const result = await query(query_str, params);
    return result.rows;
  }
}
