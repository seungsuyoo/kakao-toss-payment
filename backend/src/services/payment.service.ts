// backend/src/services/payment.service.ts
import axios from 'axios';
import prisma from '../lib/prisma';
import { TossPaymentConfirm, TossPaymentResponse } from '../types/payment.types';

export class PaymentService {
  private readonly secretKey: string;
  private readonly baseUrl = 'https://api.tosspayments.com/v1';

  constructor() {
    this.secretKey = process.env.TOSS_SECRET_KEY!;
  }

  async createOrder(userId: string, orderId: string, orderName: string, amount: number) {
    return prisma.order.create({
      data: {
        userId,
        orderId,
        orderName,
        amount,
        status: 'PENDING',
      },
    });
  }

  async confirmPayment(data: TossPaymentConfirm): Promise<TossPaymentResponse> {
    try {
      const encodedKey = Buffer.from(`${this.secretKey}:`).toString('base64');

      const response = await axios.post<TossPaymentResponse>(
        `${this.baseUrl}/payments/confirm`,
        {
          paymentKey: data.paymentKey,
          orderId: data.orderId,
          amount: data.amount,
        },
        {
          headers: {
            Authorization: `Basic ${encodedKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      await prisma.order.update({
        where: { orderId: data.orderId },
        data: {
          paymentKey: data.paymentKey,
          status: 'COMPLETED',
          approvedAt: new Date(response.data.approvedAt),
        },
      });

      return response.data;
    } catch (error) {
      console.error('Payment confirmation failed:', error);

      await prisma.order.update({
        where: { orderId: data.orderId },
        data: { status: 'FAILED' },
      });

      throw new Error('결제 승인 실패');
    }
  }

  async getOrder(orderId: string) {
    return prisma.order.findUnique({
      where: { orderId },
      include: { user: true },
    });
  }

  async getUserOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { requestedAt: 'desc' },
    });
  }

  async cancelPayment(paymentKey: string, cancelReason: string) {
    try {
      const encodedKey = Buffer.from(`${this.secretKey}:`).toString('base64');

      const response = await axios.post(
        `${this.baseUrl}/payments/${paymentKey}/cancel`,
        { cancelReason },
        {
          headers: {
            Authorization: `Basic ${encodedKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const order = await prisma.order.findFirst({
        where: { paymentKey },
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'CANCELLED' },
        });
      }

      return response.data;
    } catch (error) {
      console.error('Payment cancellation failed:', error);
      throw new Error('결제 취소 실패');
    }
  }
}
