import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { Brand } from './brand.entity';
import { BrandsService } from './brand.service';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  findAll(): Promise<Brand[]> {
    return this.brandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Brand | null> {
    return this.brandsService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Brand>): Promise<Brand> {
    return this.brandsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Brand>): Promise<Brand | null> {
    return this.brandsService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.brandsService.remove(+id);
  }
}
