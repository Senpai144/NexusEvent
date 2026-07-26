import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@ApiTags('Tableau de bord')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Statistiques globales (admin)' })
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('top-events')
  @ApiOperation({ summary: 'Top 5 événements les plus populaires' })
  getTopEvents() {
    return this.dashboardService.getTopEvents();
  }

  @Get('recent-bookings')
  @ApiOperation({ summary: 'Dernières réservations' })
  getRecentBookings() {
    return this.dashboardService.getRecentBookings();
  }
}
