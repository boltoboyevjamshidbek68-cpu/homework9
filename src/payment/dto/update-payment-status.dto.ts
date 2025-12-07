import { IsEnum } from 'class-validator';
import { PaymentStatus } from '../payment-status.enum';

export class UpdatePaymentStatusDto {
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}
