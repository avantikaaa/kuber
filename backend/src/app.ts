import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware (for frontend access)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Import routes
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import categoryRoutes from './routes/categories.js';
import analyticsRoutes from './routes/analytics.js';
import emailAccountRoutes from './routes/email-accounts.js';
import emailSuggestionsRoutes from './routes/email-suggestions.js';
import { authMiddleware } from './utils/middleware.js';

// Mount auth routes (no middleware needed)
app.use('/api/auth', authRoutes);

// Mount protected routes (all require authentication)
app.use('/api/transactions', authMiddleware as any, transactionRoutes);
app.use('/api/categories', authMiddleware as any, categoryRoutes);
app.use('/api/analytics', authMiddleware as any, analyticsRoutes);
app.use('/api/email-accounts', authMiddleware as any, emailAccountRoutes);
app.use('/api/email-suggestions', authMiddleware as any, emailSuggestionsRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
