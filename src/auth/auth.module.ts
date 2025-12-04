import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [UsersModule, CartModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
