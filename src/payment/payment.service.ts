import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './payment.entity';
import { Order } from '../order/order.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async createPayment(orderId: number, method: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const payment = this.paymentRepo.create({
      order,
      method,
      status: PaymentStatus.PENDING,
      amount: order.totalPrice,
    });

    return this.paymentRepo.save(payment);
  }

  async updateStatus(paymentId: number, status: PaymentStatus) {
    const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
    if (!payment) throw new NotFoundException('Payment not found');

    payment.status = status;
    return this.paymentRepo.save(payment);
  }

  async getAll() {
    return this.paymentRepo.find({ relations: ['order'] });
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
