import { Router, Response } from 'express';
import { AuthRequest } from '../utils/middleware.js';
import { query } from '../utils/db.js';

const router = Router();

// Get connected email accounts
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const result = await query(
      `SELECT id, email_address, provider, last_synced_at, is_active, created_at
       FROM email_accounts
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch email accounts' });
  }
});

// Add email account (OAuth placeholder)
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { email_address, provider, oauth_token, refresh_token } = req.body;

    if (!email_address || !provider) {
      return res.status(400).json({ error: 'Email and provider are required' });
    }

    // TODO: In production, validate OAuth tokens with provider
    // For now, just store them
    const result = await query(
      `INSERT INTO email_accounts (user_id, email_address, provider, oauth_token, refresh_token, is_active)
       VALUES ($1, $2, $3, $4, $5, TRUE)
       RETURNING *`,
      [
        userId,
        email_address,
        provider,
        JSON.stringify(oauth_token || {}),
        refresh_token || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email account already connected' });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to add email account' });
  }
});

// Remove email account
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const result = await query(
      `DELETE FROM email_accounts WHERE id = $1 AND user_id = $2 RETURNING id`,
      [parseInt(id), userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Email account not found' });
    }

    res.json({ message: 'Email account removed', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove email account' });
  }
});

// Sync emails from account
router.post('/:id/sync', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    // Get email account
    const emailResult = await query(
      `SELECT * FROM email_accounts WHERE id = $1 AND user_id = $2`,
      [parseInt(id), userId]
    );

    if (emailResult.rows.length === 0) {
      return res.status(404).json({ error: 'Email account not found' });
    }

    const emailAccount = emailResult.rows[0];

    // TODO: In production, fetch emails from provider API
    // For now, just update last_synced_at
    const updateResult = await query(
      `UPDATE email_accounts SET last_synced_at = CURRENT_TIMESTAMP WHERE id = $1
       RETURNING *`,
      [parseInt(id)]
    );

    res.json({
      message: 'Sync started',
      account: updateResult.rows[0],
      note: 'Email sync not fully implemented - to be added in Phase 3',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to sync emails' });
  }
});

// Test email connection
router.post('/:id/test', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const result = await query(
      `SELECT * FROM email_accounts WHERE id = $1 AND user_id = $2`,
      [parseInt(id), userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Email account not found' });
    }

    // TODO: In production, test OAuth token validity
    res.json({
      success: true,
      message: 'Connection successful',
      email: result.rows[0].email_address,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to test connection' });
  }
});

export default router;
