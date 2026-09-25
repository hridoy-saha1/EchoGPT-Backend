
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity.js';
import { RegisterDto } from '../auth/dto/register.dto.js';



// =========================
// Users Service
// =========================

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // =========================
  // User Registration
  // =========================

  async createUser(dto: RegisterDto): Promise<object> {
    const existingEmail = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    const { password, ...userWithoutPassword } = savedUser;

    return {
      message: 'User registered successfully',
      data: userWithoutPassword,
    };
  }

  // =========================
  // User CRUD
  // =========================

  async getAllUsers(): Promise<object> {
    const users = await this.userRepository.find();

    const usersWithoutPassword = users.map((user) => {
      const { password, ...safeUser } = user;
      return safeUser;
    });

    return {
      message: 'All users retrieved successfully',
      data: usersWithoutPassword,
    };
  }

  async getUserById(id: string): Promise<object> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, ...userWithoutPassword } = user;

    return {
      message: 'User retrieved successfully',
      data: userWithoutPassword,
    };
  }

  async updateUser(
    id: string,
    dto: Partial<Pick<User, 'name' | 'email'>>,
  ): Promise<object> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (dto.email && dto.email !== user.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: dto.email },
      });

      if (existingEmail) {
        throw new BadRequestException('Email already exists');
      }
    }

    Object.assign(user, dto);

    const updatedUser = await this.userRepository.save(user);

    const { password, ...userWithoutPassword } = updatedUser;

    return {
      message: `User with ID ${id} updated successfully`,
      data: userWithoutPassword,
    };
  }

  async deleteUser(id: string): Promise<object> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.remove(user);

    return {
      message: `User with ID ${id} deleted successfully`,
    };
  }
}