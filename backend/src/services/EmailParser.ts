import { query } from '../utils/db.js';
import {
  extractAmount,
  extractDate,
  extractMerchant,
  guessPaymentMode,
} from '../utils/email-patterns.js';

export interface ExtractedTransaction {
  description: string;
  amount: number;
  currency: string;
  mode_of_payment: string;
  date: Date;
  account_ending?: string;
  confidence: 'high' | 'medium' | 'low';
}

export class EmailParser {
  async parseEmail(
    emailSubject: string,
    emailBody: string,
    emailId: string
  ): Promise<ExtractedTransaction | null> {
    try {
      const fullText = `${emailSubject} ${emailBody}`;

      // Extract transaction details
      const amount = extractAmount(fullText);
      if (!amount) return null;

      const date = extractDate(fullText) || new Date();
      const merchant = extractMerchant(fullText);
      const mode = guessPaymentMode(fullText);

      if (!merchant || !mode) {
        return null; // Can't extract required fields
      }

      // Determine currency based on text
      let currency = 'USD';
      if (fullText.includes('₹')) currency = 'INR';
      else if (fullText.includes('€')) currency = 'EUR';
      else if (fullText.includes('£')) currency = 'GBP';

      // Determine confidence score
      let confidence: 'high' | 'medium' | 'low' = 'high';
      if (!mode || !date) confidence = 'medium';
      if (!merchant || amount < 0) confidence = 'low';

      return {
        description: merchant,
        amount,
        currency,
        mode_of_payment: mode,
        date,
        confidence,
      };
    } catch (error) {
      console.error('Error parsing email:', error);
      return null;
    }
  }

  // Check if email has already been processed
  async isEmailProcessed(userId: number, emailId: string): Promise<boolean> {
    const result = await query(
      `SELECT id FROM email_transactions WHERE user_id = $1 AND email_id = $2`,
      [userId, emailId]
    );
    return result.rows.length > 0;
  }

  // Save email for tracking
  async saveEmailTransaction(
    userId: number,
    emailId: string,
    emailSubject: string,
    emailBody: string,
    extracted: ExtractedTransaction | null,
    error?: string
  ) {
    const status = error ? 'failed' : extracted ? 'pending' : 'skipped';
    await query(
      `INSERT INTO email_transactions (
        user_id, email_id, email_subject, email_body, extraction_status, extraction_error
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id, email_id) DO UPDATE SET
        extraction_status = $5, extraction_error = $6, updated_at = CURRENT_TIMESTAMP`,
      [userId, emailId, emailSubject, emailBody.substring(0, 500), status, error]
    );
  }

  // Get unprocessed email suggestions
  async getEmailSuggestions(userId: number, limit: number = 5) {
    const result = await query(
      `SELECT
        id, email_id, email_subject, email_body, created_at
      FROM email_transactions
      WHERE user_id = $1 AND extraction_status = 'pending'
      ORDER BY created_at DESC
      LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  }

  // Create transaction from email
  async createTransactionFromEmail(
    userId: number,
    emailId: string,
    extracted: ExtractedTransaction,
    categoryId: number,
    subcategoryId?: number,
    bankAccountId?: number
  ) {
    const result = await query(
      `INSERT INTO transactions (
        user_id, description, amount, currency, mode_of_payment,
        bank_account_id, category_id, subcategory_id, source,
        email_source_id, transaction_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'email_import', $9, $10)
      RETURNING id`,
      [
        userId,
        extracted.description,
        extracted.amount,
        extracted.currency,
        extracted.mode_of_payment,
        bankAccountId,
        categoryId,
        subcategoryId,
        emailId,
        extracted.date,
      ]
    );

    // Update email_transactions status
    await query(
      `UPDATE email_transactions SET extraction_status = 'success', extracted_transaction_id = $2
      WHERE user_id = $1 AND email_id = $3`,
      [userId, result.rows[0].id, emailId]
    );

    return result.rows[0];
  }
}
