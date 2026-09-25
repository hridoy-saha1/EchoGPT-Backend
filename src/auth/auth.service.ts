import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto, RefreshTokenDto } from './dto/login.dto.js';
import { Session } from '../sessions/entities/session.entity.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,

    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<object> {
    return this.usersService.createUser(dto);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: dto.email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    const session = this.sessionRepository.create({
      refreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      user,
    });

    await this.sessionRepository.save(session);

    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync(dto.refreshToken);

      const sessions = await this.sessionRepository.find({
        where: {
          user: { id: payload.sub },
        },
        relations: { user: true },
      });

      let validSession: Session | null = null;

      for (const session of sessions) {
        const isMatch = await bcrypt.compare(
          dto.refreshToken,
          session.refreshTokenHash,
        );

        if (isMatch && session.expiresAt > new Date()) {
          validSession = session;
          break;
        }
      }

      if (!validSession) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = await this.jwtService.signAsync(
        {
          sub: payload.sub,
          email: payload.email,
          role: payload.role,
        },
        {
          expiresIn: '15m',
        },
      );

      return {
        message: 'Access token refreshed successfully',
        accessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(dto: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync(dto.refreshToken);

      const sessions = await this.sessionRepository.find({
        where: {
          user: { id: payload.sub },
        },
      });

      for (const session of sessions) {
        const isMatch = await bcrypt.compare(
          dto.refreshToken,
          session.refreshTokenHash,
        );

        if (isMatch) {
          await this.sessionRepository.remove(session);

          return {
            message: 'Logout successful',
          };
        }
      }

      throw new UnauthorizedException('Invalid refresh token');
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
