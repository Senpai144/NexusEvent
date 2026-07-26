import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "S'inscrire" })
  @ApiResponse({ status: 201, description: 'Inscription réussie', type: AuthResponseDto })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Se connecter' })
  @ApiResponse({ status: 200, description: 'Connexion réussie', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Identifiants incorrects' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir le profil utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Profil retourné' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }
}
