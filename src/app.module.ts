import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/product.module';
import { BrandsModule } from './brand/brand.module';
import { CategoriesModule } from './category/category.module';  
import { OrdersModule } from './order/order.module';
import { Product } from './products/product.entity';
import { Brand } from './brand/brand.entity'; 
import { Category } from './category/category.entity';
import { User } from './users/users.entity';
import { Address } from './users/address.entity';
import { Order } from './order/order.entity';
import { OrderItem } from './order/order-item.entity';  
import { PaymentsModule } from './payment/payment.module';
import { Payment } from './payment/payment.entity';
import { Role } from './roles/role.entity';
import { Cart } from './cart/cart.entity';
import { CartItem } from './cart/cart-item.entity';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'qwerty',
      database: 'exam8',
  entities: [Product, Brand, Category, User, Address, Order, OrderItem, Payment, Role, Cart, CartItem],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    BrandsModule,
    CategoriesModule,
  OrdersModule,
  CartModule,
    PaymentsModule,
  ],
})
export class AppModule {}
