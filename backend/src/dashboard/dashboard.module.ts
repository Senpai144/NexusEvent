import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Event } from '../entities/event.entity';
import { Booking } from '../entities/booking.entity';
import { User } from '../entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Booking, User]), AuthModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
