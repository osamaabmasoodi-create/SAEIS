import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import auditRoutes from './routes/auditRoutes.js';
import erpWebhookRoutes from './routes/erpWebhookRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// إعدادات Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5175'],
  credentials: true
}));

app.use(express.json());

// ربط المسارات (Routes)
app.use('/api/v1/audit', auditRoutes);
app.use('/api/v1/erp', erpWebhookRoutes);

// فحص حالة السيرفر
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'SAEIS Backend API is running successfully!',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (_req: Request, res: Response) => {
  res.send('SAEIS Backend Server Active');
});

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`[SAEIS Server] Running on port ${PORT}`);
});