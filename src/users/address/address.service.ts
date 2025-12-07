import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './address.entity';
import { UsersService } from '../users.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addrRepo: Repository<Address>,
    private usersService: UsersService,
  ) {}

  async create(userId: number, dto: CreateAddressDto): Promise<Address> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    if (dto.isDefault) await this.clearDefault(userId);

    const address = this.addrRepo.create({ ...dto, user, userId });
    return this.addrRepo.save(address);
  }

  async findByUser(userId: number): Promise<Address[]> {
    return this.addrRepo.find({ where: { userId } });
  }

  async findOne(id: number): Promise<Address> {
    const addr = await this.addrRepo.findOne({ where: { id } });
    if (!addr) throw new NotFoundException('Address not found');
    return addr;
  }

  async update(id: number, userId: number, dto: UpdateAddressDto): Promise<Address> {
    const addr = await this.findOne(id);
    if (addr.userId !== userId) throw new NotFoundException('Address not found');

    if (dto.isDefault) await this.clearDefault(userId);

    Object.assign(addr, dto);
    return this.addrRepo.save(addr);
  }

  async remove(id: number, userId: number): Promise<{ ok: boolean }> {
    const addr = await this.findOne(id);
    if (addr.userId !== userId) throw new NotFoundException('Address not found');

    await this.addrRepo.delete(id);
    return { ok: true };
  }

  private async clearDefault(userId: number) {
    await this.addrRepo.update({ userId }, { isDefault: false });
  }

  async setDefault(id: number, userId: number): Promise<Address> {
    const addr = await this.findOne(id);
    if (addr.userId !== userId) throw new NotFoundException('Address not found');

    await this.clearDefault(userId);

    addr.isDefault = true;
    return this.addrRepo.save(addr);
  }
}
