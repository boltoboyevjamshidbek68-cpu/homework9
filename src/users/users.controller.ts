import { Controller, Get, Post, Body, Param, Put, UseGuards, Req, Delete, UsePipes, ValidationPipe, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/guard';
import { Roles } from '../roles/role.decorator';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Req() req: any) {
        return this.usersService.findOne(req.user.id);
    }

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto, @Req() req: any) {

        if (req.user.id !== id && !req.user.roles.includes('ADMIN')) {
            throw new ForbiddenException('You cannot update this user');
        }
        return this.usersService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.remove(id);
    }
}
