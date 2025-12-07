import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { CartService } from 'src/cart/cart.service';
import { RegisterDto } from './dto/auth.dto';
import { LoginDto } from './dto/auth.login.dto';
import { JwtPayload } from './jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private cartService: CartService,
  ) { }

  private readonly jwtSecret = process.env.JWT_SECRET || 'super_secret_key';


  async register(dto: RegisterDto) {
    try {
      const exist = await this.usersService.findByEmail(dto.email);
      if (exist) throw new BadRequestException('Email already registered');

      const hashed = await bcrypt.hash(dto.password, 10);

      const user = await this.usersService.create({
        ...dto,
        password: hashed,
        roles: [{ id: 2, name: 'user', users: [] }],
      });

      return user;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async login(dto: LoginDto & { mergeItems?: any[] }) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Email not found');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Wrong password');

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      roles: user.roles?.map((r) => r.name) || [],
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: '1h',
    });

    if (dto.mergeItems && Array.isArray(dto.mergeItems)) {
      try {
        await this.cartService.mergeAnonymousCart(user.id, dto.mergeItems);
      } catch { }
    }

    return { access_token: accessToken };
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return jwt.verify(token, this.jwtSecret) as JwtPayload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
