import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@ApiTags('Utilisateurs')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Lister tous les utilisateurs (admin)' })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtenir un utilisateur par id (admin)' })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Modifier un utilisateur (admin)' })
  @ApiResponse({ status: 200, description: 'Utilisateur modifié' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un utilisateur (admin)' })
  @ApiResponse({ status: 200, description: 'Utilisateur supprimé' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
