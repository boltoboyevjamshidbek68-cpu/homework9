import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { ProductsService } from 'src/products/product.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private cartItemRepo: Repository<CartItem>,

    private productsService: ProductsService,
    private usersService: UsersService,

    private dataSource: DataSource,
  ) {}
  private async loadCart(cartId: number) {
    return await this.cartRepo.findOne({
      where: { id: cartId },
      relations: {
        items: { product: true },
        user: true,
      },
    });
  }

  async getCartByUser(userId: number): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: {
        items: { product: true },
      },
    });

    if (!cart) {
      const user = await this.usersService.findOne(userId);
      cart = this.cartRepo.create({ user, items: [] });
      await this.cartRepo.save(cart);
    }

    return cart;
  }

  async addItemToUserCart(userId: number, productId: number, quantity = 1) {
    if (quantity <= 0) throw new BadRequestException('Invalid quantity');

    const cart = await this.getCartByUser(userId);
    const product = await this.productsService.findOne(productId);
    if (!product) throw new NotFoundException('Product not found');

    let item = cart.items.find((i) => i.product.id === productId);

    if (item) {
      item.quantity += quantity;
      await this.cartItemRepo.save(item);
    } else {
      item = this.cartItemRepo.create({ cart, product, quantity });
      await this.cartItemRepo.save(item);
      cart.items.push(item);
    }

    return this.loadCart(cart.id);
  }

  async updateItem(userId: number, productId: number, quantity: number) {
    if (quantity == null) throw new BadRequestException('Quantity required');

    const cart = await this.getCartByUser(userId);
    const item = cart.items.find((i) => i.product.id === productId);

    if (!item) throw new NotFoundException('Item not found');

    if (quantity <= 0) {
      await this.cartItemRepo.delete(item.id);
    } else {
      item.quantity = quantity;
      await this.cartItemRepo.save(item);
    }

    return this.loadCart(cart.id);
  }

  async removeItem(userId: number, productId: number) {
    const cart = await this.getCartByUser(userId);
    const item = cart.items.find((i) => i.product.id === productId);

    if (!item) throw new NotFoundException('Item not found');

    await this.cartItemRepo.delete(item.id);
    return this.loadCart(cart.id);
  }

  async mergeAnonymousCart(
    userId: number,
    items: { productId: number; quantity: number }[],
  ) {
    const cart = await this.getCartByUser(userId);

    for (const it of items) {
      const product = await this.productsService.findOne(it.productId);
      if (!product) continue;

      let existing = cart.items.find((i) => i.product.id === it.productId);

      if (existing) {
        existing.quantity += it.quantity;
        await this.cartItemRepo.save(existing);
      } else {
        const newItem = this.cartItemRepo.create({
          cart,
          product,
          quantity: it.quantity,
        });
        await this.cartItemRepo.save(newItem);
        cart.items.push(newItem);
      }
    }

    return this.loadCart(cart.id);
  }
}
