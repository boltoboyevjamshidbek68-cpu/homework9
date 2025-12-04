import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './address.entity';
import { UsersService } from './users.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addrRepo: Repository<Address>,
    private usersService: UsersService,
  ) {}

  async create(userId: number, data: Partial<Address>): Promise<Address> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');
    const address = this.addrRepo.create({ ...data, user });
    if (data.isDefault) {
      await this.clearDefault(userId);
    }
    return this.addrRepo.save(address);
  }

  async findByUser(userId: number): Promise<Address[]> {
    return this.addrRepo.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number): Promise<Address | null> {
    return this.addrRepo.findOne({ where: { id } });
  }

  async update(id: number, userId: number, data: Partial<Address>) {
    const addr = await this.findOne(id);
    if (!addr || addr.user.id !== userId) throw new NotFoundException('Address not found');
    if (data.isDefault) await this.clearDefault(userId);
    await this.addrRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number, userId: number) {
    const addr = await this.findOne(id);
    if (!addr || addr.user.id !== userId) throw new NotFoundException('Address not found');
    await this.addrRepo.delete(id);
    return { ok: true };
  }

  private async clearDefault(userId: number) {
    await this.addrRepo.update({ user: { id: userId } } as any, { isDefault: false });
  }

  async setDefault(id: number, userId: number) {
    const addr = await this.findOne(id);
    if (!addr || addr.user.id !== userId) throw new NotFoundException('Address not found');
    await this.clearDefault(userId);
    addr.isDefault = true;
    return this.addrRepo.save(addr);
  }
}
