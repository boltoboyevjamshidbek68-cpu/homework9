import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { UsersService } from '../users/users.service';
import { AddressService } from 'src/users/address/address.service';
import { ProductsService } from 'src/products/product.service';

@Injectable()
export class OrdersService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(Order)
    private ordersRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,

    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
    private readonly addressService: AddressService,
  ) {}

  async create(
    userId: number,
    items: { productId: number; quantity: number }[],
    addressId?: number,
  ): Promise<Order> {
    if (!items || items.length === 0) {
      throw new BadRequestException('Items cannot be empty');
    }

    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const productIds = items.map((i) => i.productId);

      const products = await Promise.all(
        productIds.map((id) => this.productsService.findOne(id)),
      );

      let total = 0;
      const orderItems: OrderItem[] = [];

      for (let i = 0; i < items.length; i++) {
        const product = products[i];
        const qty = items[i].quantity;

        if (!product) {
          throw new NotFoundException(
            `Product ${items[i].productId} not found`,
          );
        }

        if (qty <= 0) {
          throw new BadRequestException('Quantity must be greater than 0');
        }

        const item = this.orderItemRepo.create({
          product,
          quantity: qty,
          price: product.price, 
        });

        total += Number(product.price) * qty;
        orderItems.push(item);
      }

      const order = this.ordersRepo.create({
        user,
        items: orderItems,
        total,
      });

      if (addressId) {
        const addr = await this.addressService.findOne(addressId);
        if (!addr) throw new NotFoundException('Address not found');
        order.address = addr;
      }

      const savedOrder = await queryRunner.manager.save(Order, order);

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findByUser(userId: number): Promise<Order[]> {
    return this.ordersRepo.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'address'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepo.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user', 'address'],
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
