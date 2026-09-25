
import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { User } from './entities/user.entity.js';
import { RegisterDto, UpdateUserDto } from '../auth/dto/register.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

@Post("register")
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
createUser(@Body() dto: RegisterDto) {
  return this.usersService.createUser(dto);
}

  @Get("allUsers")
  @UseGuards(JwtAuthGuard)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('users/:id')
  @UseGuards(JwtAuthGuard)
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch('users/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, dto);
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard)
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}