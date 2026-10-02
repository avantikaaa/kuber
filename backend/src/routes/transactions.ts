import { Router, Response } from 'express';
import { AuthRequest } from '../utils/middleware.js';
import { TransactionService } from '../services/TransactionService.js';
import { validateAmount, validatePaymentMode, validateCurrency } from '../utils/validators.js';

const router = Router();
const transactionService = new TransactionService();

// Create transaction
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { description, amount, currency, mode_of_payment, category_id, subcategory_id, bank_account_id, transaction_date } = req.body;

    // Validation
    if (!description || !amount || !currency || !mode_of_payment || !category_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!validateAmount(amount)) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (!validateCurrency(currency)) {
      return res.status(400).json({ error: 'Invalid currency' });
    }

    if (!validatePaymentMode(mode_of_payment)) {
      return res.status(400).json({ error: 'Invalid payment mode' });
    }

    const transaction = await transactionService.createTransaction(userId, {
      description,
      amount,
      currency,
      mode_of_payment,
      category_id,
      subcategory_id: subcategory_id || null,
      bank_account_id: bank_account_id || null,
      source: 'manual',
      transaction_date: transaction_date ? new Date(transaction_date) : new Date(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Get transactions with filters
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { from, to, categoryId, modeOfPayment, limit = 50, offset = 0 } = req.query;

    const filters = {
      from: from ? new Date(from as string) : undefined,
      to: to ? new Date(to as string) : undefined,
      categoryId: categoryId ? parseInt(categoryId as string) : undefined,
      modeOfPayment: modeOfPayment as string | undefined,
      limit: Math.min(parseInt(limit as string) || 50, 100),
      offset: parseInt(offset as string) || 0,
    };

    const transactions = await transactionService.getTransactions(userId, filters);
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get single transaction
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const transaction = await transactionService.getTransactionById(userId, parseInt(id));
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// Update transaction
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const updates = req.body;

    // Validate if provided
    if (updates.amount && !validateAmount(updates.amount)) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (updates.currency && !validateCurrency(updates.currency)) {
      return res.status(400).json({ error: 'Invalid currency' });
    }

    if (updates.mode_of_payment && !validatePaymentMode(updates.mode_of_payment)) {
      return res.status(400).json({ error: 'Invalid payment mode' });
    }

    const transaction = await transactionService.updateTransaction(userId, parseInt(id), updates);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Delete transaction
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const deleted = await transactionService.deleteTransaction(userId, parseInt(id));
    if (!deleted) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

export default router;
