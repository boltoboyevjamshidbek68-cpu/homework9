import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { Brand } from './brand.entity';
import { BrandsService } from './brand.service';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  async findAll(): Promise<{ success: boolean; data: Brand[] }> {
    const data = await this.brandsService.findAll();
    return { success: true, data };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean; data: Brand }> {
    const data = await this.brandsService.findOne(id);
    return { success: true, data };
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() body: Partial<Brand>) {
    const data = await this.brandsService.create(body);
    return { success: true, message: 'Brand created', data };
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<Brand>,
  ) {
    const data = await this.brandsService.update(id, body);
    return { success: true, message: 'Brand updated', data };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.brandsService.remove(id);
    return { success: true, message: 'Brand deleted' };
  }
}
