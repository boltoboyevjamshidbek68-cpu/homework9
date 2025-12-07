import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Product } from './product.entity';
import { Brand } from 'src/brand/brand.entity';
import { Category } from 'src/category/category.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly prodRepo: Repository<Product>,

    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll(query: any): Promise<{ data: Product[]; total: number }> {
    try {
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

      if (page <= 0 || limit <= 0)
        throw new BadRequestException('page or limit incorrect');

      const where: any = {};

      if (brand) {
        const b = await this.brandRepo.findOne({ where: { name: brand } });
        if (!b) throw new NotFoundException('Brand not found');
        where.brand = { id: b.id };
      }

      if (category) {
        const c = await this.categoryRepo.findOne({ where: { name: category } });
        if (!c) throw new NotFoundException('Category not found');
        where.category = { id: c.id };
      }

      if (memory) where.memory = memory;

      if (minPrice || maxPrice) {
        if (minPrice && maxPrice) {
          where.price = Between(minPrice, maxPrice);
        } else if (minPrice) {
          where.price = MoreThanOrEqual(minPrice);
        } else if (maxPrice) {
          where.price = LessThanOrEqual(maxPrice);
        }
      }

      const order: any = {};
      if (sort === 'price_asc') order.price = 'ASC';
      if (sort === 'price_desc') order.price = 'DESC';
      if (sort === 'rating') order.rating = 'DESC';

      const [data, total] = await this.prodRepo.findAndCount({
        where,
        order,
        skip: (page - 1) * limit,
        take: limit,
        relations: ['brand', 'category'],
      });

      return { data, total };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.prodRepo.findOne({
      where: { id },
      relations: ['brand', 'category'],
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    try {
      if (dto.brandId) {
        const brand = await this.brandRepo.findOne({ where: { id: dto.brandId } });
        if (!brand) throw new NotFoundException('Brand not found');
      }

      if (dto.categoryId) {
        const cat = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
        if (!cat) throw new NotFoundException('Category not found');
      }

      const product = this.prodRepo.create(dto);
      return await this.prodRepo.save(product);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    try {
      Object.assign(product, dto);
      return await this.prodRepo.save(product);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    const product = await this.findOne(id);

    await this.prodRepo.delete(id);
    return { message: `Product ${product.id} deleted` };
  }
}
