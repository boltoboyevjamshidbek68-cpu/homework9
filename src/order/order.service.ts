import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { UsersService } from '../users/users.service';
import { AddressService } from 'src/users/address.service';
import { ProductsService } from 'src/products/product.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,
    private productsService: ProductsService,
    private usersService: UsersService,
    private addressService: AddressService,
  ) {}

  async create(
    userId: number,
    items: { productId: number; quantity: number }[],
    addressId?: number,
  ): Promise<Order> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const it of items) {
      const product = await this.productsService.findOne(it.productId);
      if (!product) throw new NotFoundException(`Product ${it.productId} not found`);
      const item = this.orderItemRepo.create({
        product,
        quantity: it.quantity,
      });
      total += Number(product.price) * it.quantity;
      orderItems.push(item);
    }

    const orderData: any = {
      user,
      items: orderItems,
      total,
    };

    if (addressId) {
      const addr = await this.addressService.findOne(addressId);
      if (addr) orderData.address = addr;
    }

    const order = this.ordersRepo.create(orderData);

    const saved = await this.ordersRepo.save(order);
    if (Array.isArray(saved)) return saved[0];
    return saved;
  }

  async findByUser(userId: number): Promise<Order[]> {
    return this.ordersRepo.find({
      where: { user: { id: userId } },
    });
  }

  async findOne(id: number): Promise<Order | null> {
    return this.ordersRepo.findOne({
      where: { id },
    });
  }
}
