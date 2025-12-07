import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private catRepo: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.catRepo.find({
      relations: ['products'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Category | null> {
    return await this.catRepo.findOne({
      where: { id },
      relations: ['products'],
    });
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const newCat = this.catRepo.create(dto);
    return this.catRepo.save(newCat);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category | null> {
    await this.catRepo.update(id, dto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException('Category not found');
    await this.catRepo.delete(id);
  }
}
