import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
  ) { }

  async findAll(): Promise<Brand[]> {
    return this.brandRepo.find({
      relations: ['products'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandRepo.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!brand) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }

    return brand;
  }
  async create(data: Partial<Brand>): Promise<Brand> {
    try {
      if (data.name) {
        const exist = await this.brandRepo.findOne({
          where: { name: data.name },
        });
        if (exist) throw new BadRequestException('Brand with this name already exists');
      }

      const brand = this.brandRepo.create(data);
      return await this.brandRepo.save(brand);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async update(id: number, data: Partial<Brand>): Promise<Brand> {
    const brand = await this.findOne(id);

    if (data.name && data.name !== brand.name) {
      const exist = await this.brandRepo.findOne({ where: { name: data.name } });
      if (exist) throw new BadRequestException('Brand name already exists');
    }

    Object.assign(brand, data);
    return await this.brandRepo.save(brand);
  }

  async remove(id: number): Promise<void> {
    const brand = await this.findOne(id);

    if (brand.products && brand.products.length > 0) {
      throw new BadRequestException(
        'Cannot delete brand that has products linked to it',
      );
    }

    await this.brandRepo.delete(id);
  }
}
