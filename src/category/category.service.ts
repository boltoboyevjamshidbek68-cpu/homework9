// categories.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private catRepo: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.catRepo.find({ relations: ['products'] });
  }

  findOne(id: number): Promise<Category | null> {
    return this.catRepo.findOne({ where: { id }, relations: ['products'] });
  }

  create(data: Partial<Category>): Promise<Category> {
    const cat = this.catRepo.create(data);
    return this.catRepo.save(cat);
  }

  async update(id: number, data: Partial<Category>): Promise<Category | null> {
    await this.catRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.catRepo.delete(id);
  }
}
