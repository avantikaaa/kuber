import { Router, Request, Response } from 'express';
import { query } from '../utils/db.js';

const router = Router();
const getMockUserId = () => 1;

// Get all categories (system + user)
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = getMockUserId();

    const result = await query(
      `SELECT * FROM categories WHERE is_system = TRUE OR user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create category
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = getMockUserId();
    const { name, color } = req.body;

    if (!name || !color) {
      return res.status(400).json({ error: 'Name and color are required' });
    }

    const result = await query(
      `INSERT INTO categories (user_id, name, color, is_system)
       VALUES ($1, $2, $3, FALSE)
       RETURNING *`,
      [userId, name, color]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Category already exists for this user' });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = getMockUserId();
    const { id } = req.params;
    const { name, color } = req.body;

    const updates = [];
    const values: any[] = [userId, parseInt(id)];
    let paramIndex = 3;

    if (name) {
      updates.push(`name = $${paramIndex}`);
      values.splice(2, 0, name);
      paramIndex++;
    }

    if (color) {
      updates.push(`color = $${paramIndex}`);
      values.splice(2 + (name ? 1 : 0), 0, color);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const result = await query(
      `UPDATE categories SET ${updates.join(', ')} WHERE id = $1 AND user_id = $2 RETURNING *`,
      [parseInt(id), userId, ...values.slice(2)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = getMockUserId();
    const { id } = req.params;

    const result = await query(
      `DELETE FROM categories WHERE id = $1 AND user_id = $2 AND is_system = FALSE RETURNING id`,
      [parseInt(id), userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found or is system category' });
    }

    res.json({ message: 'Category deleted', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Get subcategories for category
router.get('/:categoryId/subcategories', async (req: Request, res: Response) => {
  try {
    const userId = getMockUserId();
    const { categoryId } = req.params;

    const result = await query(
      `SELECT s.*, COUNT(t.id) as frequency
       FROM subcategories s
       LEFT JOIN transactions t ON t.subcategory_id = s.id AND t.user_id = $1
       WHERE s.category_id = $2 AND (s.user_id IS NULL OR s.user_id = $1)
       GROUP BY s.id
       ORDER BY frequency DESC, s.created_at DESC`,
      [userId, parseInt(categoryId)]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

// Create subcategory
router.post('/:categoryId/subcategories', async (req: Request, res: Response) => {
  try {
    const userId = getMockUserId();
    const { categoryId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const result = await query(
      `INSERT INTO subcategories (category_id, user_id, name)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [parseInt(categoryId), userId, name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create subcategory' });
  }
});

export default router;
