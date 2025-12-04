import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
  ) {}

  findAll(): Promise<Brand[]> {
    return this.brandRepo.find({ relations: ['products'] });
  }

  findOne(id: number): Promise<Brand | null> {
    return this.brandRepo.findOne({ where: { id }, relations: ['products'] });
  }

  async create(data: Partial<Brand>): Promise<Brand> {
    const newBrand = this.brandRepo.create(data);
    return this.brandRepo.save(newBrand);
  }

  async update(id: number, data: Partial<Brand>): Promise<Brand | null> {
    await this.brandRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.brandRepo.delete(id);
  }
}
