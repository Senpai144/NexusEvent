import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '../entities/user.entity';

@ApiTags('Réservations')
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Lister toutes les réservations (admin)' })
  @ApiResponse({ status: 200, description: 'Liste des réservations' })
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get('me')
  @ApiOperation({ summary: 'Mes réservations' })
  @ApiResponse({ status: 200, description: 'Réservations de l\'utilisateur' })
  findMyBookings(@Request() req) {
    return this.bookingsService.findByUserOrEmail(req.user.id, req.user.email);
  }

  @Get('event/:eventId')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({ summary: 'Réservations par événement (admin/organizer)' })
  @ApiResponse({ status: 200, description: 'Réservations de l\'événement' })
  findByEvent(@Param('eventId') eventId: string) {
    return this.bookingsService.findByEvent(eventId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une réservation par id' })
  @ApiResponse({ status: 200, description: 'Réservation trouvée' })
  @ApiResponse({ status: 404, description: 'Réservation non trouvée' })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une réservation' })
  @ApiResponse({ status: 201, description: 'Réservation créée' })
  @ApiResponse({ status: 400, description: 'Plus de places disponibles' })
  create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    const userId = req.user?.id || createBookingDto.userId || null;
    return this.bookingsService.create(createBookingDto, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une réservation (propriétaire ou admin)' })
  @ApiResponse({ status: 200, description: 'Réservation modifiée' })
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Request() req,
  ) {
    return this.bookingsService.update(id, updateBookingDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Annuler une réservation (propriétaire ou admin)' })
  @ApiResponse({ status: 200, description: 'Réservation supprimée' })
  remove(@Param('id') id: string, @Request() req) {
    return this.bookingsService.remove(id, req.user.id, req.user.role);
  }
}
