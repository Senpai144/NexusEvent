import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { EventCategory } from '../entities/event.entity';
import { UserRole } from '../entities/user.entity';

@ApiTags('Événements')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lister tous les événements' })
  @ApiQuery({ name: 'category', enum: EventCategory, required: false })
  @ApiResponse({ status: 200, description: 'Liste des événements' })
  findAll(@Query('category') category?: EventCategory) {
    return this.eventsService.findAll(category);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtenir un événement par id' })
  @ApiResponse({ status: 200, description: 'Événement trouvé' })
  @ApiResponse({ status: 404, description: 'Événement non trouvé' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un événement (admin/organizer)' })
  @ApiResponse({ status: 201, description: 'Événement créé' })
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create(createEventDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un événement (propriétaire ou admin)' })
  @ApiResponse({ status: 200, description: 'Événement modifié' })
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req,
  ) {
    return this.eventsService.update(id, updateEventDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un événement (propriétaire ou admin)' })
  @ApiResponse({ status: 200, description: 'Événement supprimé' })
  remove(@Param('id') id: string, @Request() req) {
    return this.eventsService.remove(id, req.user.id, req.user.role);
  }
}
