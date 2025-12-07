import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { Address } from './address/address.entity';
import { AddressService } from './address/address.service';
import { AddressController } from './address/address.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],
  providers: [UsersService, AddressService],
  controllers: [AddressController],
  exports: [UsersService, AddressService],
})
export class UsersModule {}
