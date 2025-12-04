import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, In } from 'typeorm';
import { Product } from './product.entity';
import { Brand } from 'src/brand/brand.entity';
import { Category } from 'src/category/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private prodRepo: Repository<Product>,
    @InjectRepository(Brand)
    private brandRepo: Repository<Brand>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async findAll(query: any): Promise<{ data: Product[]; total: number }> {
    const {
      brand,
      category,
      memory,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10,
    } = query;

    const where: FindOptionsWhere<Product> = {};

    if (brand) {
      const b = await this.brandRepo.findOne({ where: { name: brand } });
      if (b) where.brand = { id: b.id };
    }

    if (category) {
      const c = await this.categoryRepo.findOne({ where: { name: category } });
      if (c) where.category = { id: c.id };
    }

    if (memory) {
      where.memory = memory;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      if (minPrice !== undefined) (where.price as any).gte = minPrice;
      if (maxPrice !== undefined) (where.price as any).lte = maxPrice;
    }

    const order: any = {};
    if (sort === 'price_asc') order.price = 'ASC';
    else if (sort === 'price_desc') order.price = 'DESC';
    else if (sort === 'rating') order.rating = 'DESC';

    const [data, total] = await this.prodRepo.findAndCount({
      where,
      order,
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  async findOne(id: number): Promise<Product | null> {
    return this.prodRepo.findOne({ where: { id } });
  }

  async create(data: Partial<Product>): Promise<Product> {
    const product = this.prodRepo.create(data);
    return this.prodRepo.save(product);
  }

  async update(id: number, data: Partial<Product>): Promise<Product | null> {
    await this.prodRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.prodRepo.delete(id);
  }
}
