import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async getCartByUser(userId: number): Promise<Cart> {
    let cart = await this.cartRepo.findOne({ where: { user: { id: userId } } });
    if (!cart) {
      cart = this.cartRepo.create({ user: await this.usersService.findOne(userId), items: [] });
      await this.cartRepo.save(cart);
    }
    return cart;
  }

  async addItemToUserCart(userId: number, productId: number, quantity = 1) {
    const cart = await this.getCartByUser(userId);
    const product = await this.productsService.findOne(productId);
    if (!product) throw new NotFoundException('Product not found');

    const existing = cart.items.find((i) => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
      await this.cartItemRepo.save(existing);
    } else {
      const item = this.cartItemRepo.create({ cart, product, quantity });
      await this.cartItemRepo.save(item);
      cart.items.push(item);
    }

    return this.cartRepo.findOne({ where: { id: cart.id } });
  }

  async updateItem(userId: number, productId: number, quantity: number) {
    const cart = await this.getCartByUser(userId);
    const item = cart.items.find((i) => i.product.id === productId);
    if (!item) throw new NotFoundException('Cart item not found');
    if (quantity <= 0) {
      await this.cartItemRepo.delete(item.id);
    } else {
      item.quantity = quantity;
      await this.cartItemRepo.save(item);
    }
    return this.cartRepo.findOne({ where: { id: cart.id } });
  }

  async removeItem(userId: number, productId: number) {
    const cart = await this.getCartByUser(userId);
    const item = cart.items.find((i) => i.product.id === productId);
    if (!item) throw new NotFoundException('Cart item not found');
    await this.cartItemRepo.delete(item.id);
    return this.cartRepo.findOne({ where: { id: cart.id } });
  }

  async mergeAnonymousCart(userId: number, items: { productId: number; quantity: number }[]) {
    const cart = await this.getCartByUser(userId);
    for (const it of items) {
      const product = await this.productsService.findOne(it.productId);
      if (!product) continue;
      const existing = cart.items.find((i) => i.product.id === product.id);
      if (existing) {
        existing.quantity += it.quantity;
        await this.cartItemRepo.save(existing);
      } else {
        const newItem = this.cartItemRepo.create({ cart, product, quantity: it.quantity });
        await this.cartItemRepo.save(newItem);
        cart.items.push(newItem);
      }
    }
    return this.cartRepo.findOne({ where: { id: cart.id } });
  }
}
