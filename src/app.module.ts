import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/product.module';
import { BrandsModule } from './brand/brand.module';
import { CategoriesModule } from './category/category.module';
import { OrdersModule } from './order/order.module';
import { PaymentsModule } from './payment/payment.module';
import { CartModule } from './cart/cart.module';
import { User } from './users/users.entity';
import { Role } from './roles/role.entity';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE as any) || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'qwerty',
      database: process.env.DB_NAME || 'exam8',
      entities: [User, Role], 
      autoLoadEntities: true,
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
export class AppModule { }
