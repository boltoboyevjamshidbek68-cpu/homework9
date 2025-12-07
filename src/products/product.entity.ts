import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Brand } from 'src/brand/brand.entity';
import { Category } from 'src/category/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('text', { array: true, nullable: true })
  images: string[];

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  stock: number;

  @ManyToOne(() => Category, (category) => category.products, { nullable: true, eager: true })
  @JoinColumn({ name: 'categoryId' })
  category?: Category;

  @Column({ nullable: true })
  categoryId?: number;

  @ManyToOne(() => Brand, (brand) => brand.products, { nullable: true, eager: true })
  @JoinColumn({ name: 'brandId' })
  brand?: Brand;

  @Column({ nullable: true })
  brandId?: number;

  @Column({ nullable: true })
  memory?: number;

  @Column({ default: 0 })
  rating: number;
}
