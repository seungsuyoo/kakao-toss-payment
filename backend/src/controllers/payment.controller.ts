// backend/src/controllers/payment.controller.ts
import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { v4 as uuidv4 } from 'uuid';

const paymentService = new PaymentService();

export class PaymentController {
  async createOrder(req: Request, res: Response) {
    const { userId, orderName, amount } = req.body;

    if (!userId || !orderName || !amount) {
      return res.status(400).json({ error: '필수 정보가 누락되었습니다' });
    }

    try {
      const orderId = `ORDER_${uuidv4()}`;

      const order = await paymentService.createOrder(userId, orderId, orderName, amount);

      res.json({ order });
    } catch (error) {
      console.error('Order creation failed:', error);
      res.status(500).json({ error: '주문 생성 실패' });
    }
  }

  async confirmPayment(req: Request, res: Response) {
    const { paymentKey, orderId, amount } = req.body;

    if (!paymentKey || !orderId || !amount) {
      return res.status(400).json({ error: '필수 정보가 누락되었습니다' });
    }

    try {
      const result = await paymentService.confirmPayment({
        paymentKey,
        orderId,
        amount,
      });

      res.json({ success: true, payment: result });
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      res.status(500).json({ error: '결제 승인 실패' });
    }
  }

  async getOrder(req: Request, res: Response) {
    const { orderId } = req.params;

    try {
      const order = await paymentService.getOrder(orderId);

      if (!order) {
        return res.status(404).json({ error: '주문을 찾을 수 없습니다' });
      }

      res.json({ order });
    } catch (error) {
      res.status(500).json({ error: '주문 조회 실패' });
    }
  }

  async getUserOrders(req: Request, res: Response) {
    const { userId } = req.params;

    try {
      const orders = await paymentService.getUserOrders(userId);
      res.json({ orders });
    } catch (error) {
      res.status(500).json({ error: '주문 목록 조회 실패' });
    }
  }

  async cancelPayment(req: Request, res: Response) {
    const { paymentKey } = req.params;
    const { cancelReason } = req.body;

    if (!cancelReason) {
      return res.status(400).json({ error: '취소 사유가 필요합니다' });
    }

    try {
      const result = await paymentService.cancelPayment(paymentKey, cancelReason);
      res.json({ success: true, cancellation: result });
    } catch (error) {
      res.status(500).json({ error: '결제 취소 실패' });
    }
  }
}
