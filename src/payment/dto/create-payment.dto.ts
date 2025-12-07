export class CreatePaymentDto {
  userId: number;
  amount: number;
  month: string;  
  method: string; 
  orderId: number;
}
