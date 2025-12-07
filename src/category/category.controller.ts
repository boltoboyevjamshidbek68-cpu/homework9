import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from './category.service';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private catService: CategoriesService) {}

  @Get()
  async findAll(): Promise<Category[]> {
    return this.catService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    const category = await this.catService.findOne(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  @Post()
  async create(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.catService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ): Promise<Category> {
    const updated = await this.catService.update(id, dto);
    if (!updated) throw new NotFoundException('Category not found');
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ deleted: true }> {
    await this.catService.remove(id);
    return { deleted: true };
  }
}
