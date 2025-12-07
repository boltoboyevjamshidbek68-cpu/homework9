import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { MergeCartDto } from './dto/merge-cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCart(@Req() req: any) {
    return await this.cartService.getCartByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addItem(@Req() req: any, @Body() dto: AddItemDto) {
    return await this.cartService.addItemToUserCart(
      req.user.id,
      dto.productId,
      dto.quantity ?? 1,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('item')
  async updateItem(@Req() req: any, @Body() dto: UpdateItemDto) {
    return await this.cartService.updateItem(
      req.user.id,
      dto.productId,
      dto.quantity,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('item')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeItem(@Req() req: any, @Body() dto: UpdateItemDto) {
    await this.cartService.removeItem(req.user.id, dto.productId);
    return;
  }

  @Post('merge')
  async merge(@Body() body: MergeCartDto) {
    return await this.cartService.mergeAnonymousCart(
      body.userId,
      body.items,
    );
  }
}
