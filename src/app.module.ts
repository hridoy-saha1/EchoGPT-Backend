import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { SubscriptionsModule } from './subscriptions/subscriptions.module.js';
import { UserSubscriptionsModule } from './user-subscriptions/user-subscriptions.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
   
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'hridoy',
      database: 'echogpt_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
     AuthModule,
    UsersModule,
    SubscriptionsModule,
    UserSubscriptionsModule,
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
