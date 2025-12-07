import { Controller, Post, Body, UseGuards, Req, Get, Param, Put, Delete, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { AddressService } from './address.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addrService: AddressService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Req() req: any, @Body() dto: CreateAddressDto) {
    return this.addrService.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Req() req: any) {
    return this.addrService.findByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAddressDto) {
    return this.addrService.update(id, req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.addrService.remove(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/default')
  setDefault(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.addrService.setDefault(id, req.user.id);
  }
}
