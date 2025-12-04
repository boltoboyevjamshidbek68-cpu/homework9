
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Category } from 'src/category/category.entity';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';
import { Brand } from 'src/brand/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Brand, Category])],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}

