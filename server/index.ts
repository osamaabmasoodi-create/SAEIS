import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import auditRoutes from './src/routes/auditRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5175',
  credentials: true
}));

app.use(express.json());

// ربط مسار معالجة الإكسل والتدقيق
app.use('/api/v1/audit', auditRoutes);

app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'SAEIS Backend API is running successfully!',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[SAEIS Server] Running on http://localhost:${PORT}`);
});