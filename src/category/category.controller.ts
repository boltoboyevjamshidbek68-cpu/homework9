// categories.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { Category } from './category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private catService: CategoriesService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.catService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Category | null> {
    return this.catService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Category>): Promise<Category> {
    return this.catService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Category>): Promise<Category | null> {
    return this.catService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.catService.remove(+id);
  }
}
