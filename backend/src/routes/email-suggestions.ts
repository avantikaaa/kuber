import { Router, Response } from 'express';
import { AuthRequest } from '../utils/middleware.js';
import { query } from '../utils/db.js';
import { EmailParser } from '../services/EmailParser.js';

const router = Router();
const emailParser = new EmailParser();

// Get email suggestions (unprocessed emails)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { limit = 5 } = req.query;

    const suggestions = await emailParser.getEmailSuggestions(userId, parseInt(limit as string));

    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch email suggestions' });
  }
});

// Create transaction from email
router.post('/:emailId/import', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { emailId } = req.params;
    const { categoryId, subcategoryId, bankAccountId } = req.body;

    if (!categoryId) {
      return res.status(400).json({ error: 'Category is required' });
    }

    // Get email transaction record
    const emailTxnResult = await query(
      `SELECT * FROM email_transactions WHERE user_id = $1 AND email_id = $2 AND extraction_status = 'pending'`,
      [userId, emailId]
    );

    if (emailTxnResult.rows.length === 0) {
      return res.status(404).json({ error: 'Email not found or already processed' });
    }

    const emailTxn = emailTxnResult.rows[0];

    // Parse email to extract transaction details
    // TODO: In production, use actual email body parsing
    // For now, create a mock extracted transaction
    const extractedTransaction = {
      description: 'Transaction from email',
      amount: 100.00,
      currency: 'USD',
      mode_of_payment: 'card',
      date: new Date(),
      confidence: 'medium' as const,
    };

    // Create transaction
    const txnResult = await query(
      `INSERT INTO transactions (
        user_id, description, amount, currency, mode_of_payment,
        bank_account_id, category_id, subcategory_id, source,
        email_source_id, transaction_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'email_import', $9, $10)
      RETURNING *`,
      [
        userId,
        extractedTransaction.description,
        extractedTransaction.amount,
        extractedTransaction.currency,
        extractedTransaction.mode_of_payment,
        bankAccountId || null,
        categoryId,
        subcategoryId || null,
        emailId,
        extractedTransaction.date,
      ]
    );

    // Update email transaction status
    await query(
      `UPDATE email_transactions SET extraction_status = 'success', extracted_transaction_id = $2
       WHERE user_id = $1 AND email_id = $3`,
      [userId, txnResult.rows[0].id, emailId]
    );

    res.json({
      message: 'Transaction created from email',
      transaction: txnResult.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to import email as transaction' });
  }
});

// Skip email (mark as skipped)
router.post('/:emailId/skip', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { emailId } = req.params;

    await query(
      `UPDATE email_transactions SET extraction_status = 'skipped'
       WHERE user_id = $1 AND email_id = $2`,
      [userId, emailId]
    );

    res.json({ message: 'Email skipped' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to skip email' });
  }
});

export default router;
