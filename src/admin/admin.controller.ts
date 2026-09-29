import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';

import { AdminService } from './admin.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ==============================
  // Dashboard Statistics
  // ==============================
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics retrieved successfully',
    schema: {
      example: {
        totalUsers: 120,
        totalSubscriptions: 120,
        activeSubscriptions: 100,
        totalAIProviders: 3,
        enabledAIProviders: 2,
        totalChatMessages: 450,
        totalWebSearches: 85,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Get('dashboard/stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // ==============================
  // User Management
  // ==============================

  // Get all users
  @Get('users')
  getAllUsers(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.adminService.getAllUsers(Number(page), Number(limit));
  }

  // Get user by ID
  @Get('users/:id')
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getUserById(id);
  }

  // Update user name and email
  @Patch('users/:id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: { name?: string; email?: string },
  ) {
    return this.adminService.updateUser(id, data);
  }

  // Update user role
  @Patch('users/:id/role')
  updateUserRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('role') role: string,
  ) {
    return this.adminService.updateUserRole(id, role);
  }

  // Delete user
  @Delete('users/:id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteUser(id);
  }
}
