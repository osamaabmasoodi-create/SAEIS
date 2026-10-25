import { Router, Request, Response } from 'express';

const router = Router();

// واجهة استقبال الـ Webhook من أنظمة ERP
router.post('/webhook', (req: Request, res: Response) => {
  try {
    const webhookData = req.body;
    console.log('[ERP Webhook Received]:', JSON.stringify(webhookData, null, 2));

    if (!webhookData || Object.keys(webhookData).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'بيانات غير صالحة أو حمولة فارغة (Empty Payload)'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'تم استقبال قيد ERP وبدء التدقيق التلقائي بنجاح',
      processedAt: new Date().toISOString(),
      receivedEntriesCount: Array.isArray(webhookData) ? webhookData.length : 1
    });

  } catch (error: any) {
    console.error('[ERP Webhook Error]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'حدث خطأ أثناء معالجة بيانات الـ Webhook',
      error: error.message
    });
  }
});

router.get('/webhook/status', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'active',
    service: 'SAEIS ERP Webhook Listener',
    timestamp: new Date().toISOString()
  });
});

export default router;