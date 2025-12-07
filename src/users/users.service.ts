import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepo.find({ relations: ['roles', 'addresses', 'orders'] });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email }, relations: ['roles'] });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id }, relations: ['roles', 'addresses', 'orders'] });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, data);
    return this.usersRepo.save(user);
  }

  async remove(id: number): Promise<{ ok: boolean }> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    await this.usersRepo.delete(id);
    return { ok: true };
  }
}
