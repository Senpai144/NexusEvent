import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WeatherModule } from './weather/weather.module';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'nexusevent.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    EventsModule,
    BookingsModule,
    ReviewsModule,
    DashboardModule,
    WeatherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private authService: AuthService) {}

  async onModuleInit() {
    await this.authService.seedAdmin();
  }
}
