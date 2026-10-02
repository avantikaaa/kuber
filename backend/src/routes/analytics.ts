import { Router, Request, Response } from 'express';
import { TransactionService } from '../services/TransactionService.js';

const router = Router();
const transactionService = new TransactionService();
const getMockUserId = () => 1;

// Get spending trends (by category or payment mode)
router.get('/spending-trends', async (req: Request, res: Response) => {
  try {
    const userId = getMockUserId();
    const { period = '30', view = 'category' } = req.query;
    const days = parseInt(period as string) || 30;

    if (view === 'category') {
      // Get spending by category for the period
      const from = new Date();
      from.setDate(from.getDate() - days);

      const spendingByCategory = await transactionService.getSpendingByCategory(userId, from);
      const total = spendingByCategory.reduce((sum: number, item: any) => sum + parseFloat(item.total), 0);

      const data = spendingByCategory.map((item: any) => ({
        ...item,
        percentage: ((parseFloat(item.total) / total) * 100).toFixed(2),
      }));

      res.json({ period, view, data, total: total.toFixed(2) });
    } else if (view === 'payment_mode') {
      // Get spending by payment mode for the period
      const from = new Date();
      from.setDate(from.getDate() - days);

      const spendingByMode = await transactionService.getPaymentModeBreakdown(userId, from);
      const total = spendingByMode.reduce((sum: number, item: any) => sum + parseFloat(item.total), 0);

      const data = spendingByMode.map((item: any) => ({
        ...item,
        percentage: ((parseFloat(item.total) / total) * 100).toFixed(2),
      }));

      res.json({ period, view, data, total: total.toFixed(2) });
    } else if (view === 'trend') {
      // Get trend over time
      const trendData = await transactionService.getSpendingTrend(userId, days);
      res.json({ period, view, data: trendData });
    } else {
      return res.status(400).json({ error: 'Invalid view. Use: category, payment_mode, or trend' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch spending trends' });
  }
});

// Get dashboard summary
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const userId = getMockUserId();

    // Current month (pie chart data)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const currentMonthSpending = await transactionService.getSpendingByCategory(userId, monthStart);
    const currentMonthTotal = currentMonthSpending.reduce((sum: number, item: any) => sum + parseFloat(item.total), 0);

    // Last 30 days (trend data)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const trendData = await transactionService.getSpendingTrend(userId, 30);

    // Payment mode breakdown
    const paymentModes = await transactionService.getPaymentModeBreakdown(userId, monthStart);

    res.json({
      currentMonth: {
        total: currentMonthTotal.toFixed(2),
        spending: currentMonthSpending,
      },
      trend30Days: trendData,
      paymentModes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;
