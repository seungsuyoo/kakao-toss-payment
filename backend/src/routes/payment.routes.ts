// backend/src/routes/payment.routes.ts
import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';

const router = Router();
const paymentController = new PaymentController();

router.post('/orders', paymentController.createOrder);
router.post('/confirm', paymentController.confirmPayment);
router.get('/orders/:orderId', paymentController.getOrder);
router.get('/users/:userId/orders', paymentController.getUserOrders);
router.post('/cancel/:paymentKey', paymentController.cancelPayment);

export default router;
