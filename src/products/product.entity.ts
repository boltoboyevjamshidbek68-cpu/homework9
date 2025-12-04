import { Brand } from 'src/brand/brand.entity';
import { Category } from 'src/category/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';


@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column()
  imageUrl: string;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ nullable: true })
  memory: string;

  @Column({ nullable: true })
  batteryCapacity: string;

  @Column({ nullable: true })
  screenType: string;

  @Column({ nullable: true })
  screenDiagonal: string;

  @Column({ nullable: true })
  protectionClass: string;

  @ManyToOne(() => Brand, (brand) => brand.products, { eager: true })
  brand: Brand;

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
