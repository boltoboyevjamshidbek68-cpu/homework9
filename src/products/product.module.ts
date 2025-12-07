import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { Product } from './product.entity';
import { Brand } from 'src/brand/brand.entity';
import { Category } from 'src/category/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Brand, Category]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
