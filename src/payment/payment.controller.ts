import { Controller, Get, Post, Param, Body, Patch, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Get()
  getAll() {
    return this.paymentsService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.getOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(dto.orderId, dto.method);
  }

  @Patch(':id/status')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaymentStatusDto,
  ) {
    return this.paymentsService.updateStatus(id, dto.status);
  }
}
