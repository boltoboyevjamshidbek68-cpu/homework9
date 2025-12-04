import { Controller, Get, Post, Param, Body, Patch } from '@nestjs/common';
import { PaymentStatus } from './payment.entity';
import { PaymentsService } from './payment.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  getAll() {
    return this.paymentsService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.paymentsService.getOne(id);
  }

  @Post()
  createPayment(
    @Body() body: { orderId: number; method: string },
  ) {
    return this.paymentsService.createPayment(body.orderId, body.method);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: number,
    @Body() body: { status: PaymentStatus },
  ) {
    return this.paymentsService.updateStatus(id, body.status);
  }
}
