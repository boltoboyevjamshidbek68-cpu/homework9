import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { PaymentStatus } from './payment-status.enum';
import { Order } from '../order/order.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) { }

  async createPayment(orderId: number, method: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['payments'],
    });

    if (!order) throw new NotFoundException('Order not found');

   const existingPayment =
  order.payment?.status === PaymentStatus.PAID ? order.payment : null;

    if (existingPayment) {
      throw new BadRequestException('This order is already paid.');
    }

    const payment = this.paymentRepo.create({
      order,
      method,
      status: PaymentStatus.PENDING,
      amount: order.totalPrice,
    });

    return this.paymentRepo.save(payment);
  }

  async updateStatus(paymentId: number, status: PaymentStatus) {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: ['order'],
    });

    if (!payment) throw new NotFoundException('Payment not found');

    if (payment.status === PaymentStatus.PAID) {
      throw new BadRequestException('Paid payment cannot change status.');
    }

    if (payment.status === PaymentStatus.CANCELLED) {
      throw new BadRequestException('Cancelled payment cannot change status.');
    }

    payment.status = status;
    return this.paymentRepo.save(payment);
  }

  async getAll() {
    return this.paymentRepo.find({
      relations: ['order'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOne(id: number) {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['order'],
    });

    if (!payment) throw new NotFoundException('Payment not found');

    return payment;
  }
}
