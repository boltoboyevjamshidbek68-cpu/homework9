import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './product.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private prodService: ProductsService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.prodService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product | null> {
    return this.prodService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() data: Partial<Product>) {
    return this.prodService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Product>) {
    return this.prodService.update(+id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prodService.remove(+id);
  }
}
