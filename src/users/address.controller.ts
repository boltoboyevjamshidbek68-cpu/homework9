import { Controller, Post, Body, UseGuards, Req, Get, Param, Put, Delete } from '@nestjs/common';
import { AddressService } from './address.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('addresses')
export class AddressController {
  constructor(private addrService: AddressService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() body: any) {
    return this.addrService.create(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Req() req: any) {
    return this.addrService.findByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.addrService.update(Number(id), req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.addrService.remove(Number(id), req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/default')
  async setDefault(@Req() req: any, @Param('id') id: string) {
    return this.addrService.setDefault(Number(id), req.user.id);
  }
}
