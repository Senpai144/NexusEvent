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
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Avis')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lister tous les avis' })
  @ApiResponse({ status: 200, description: 'Liste des avis' })
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtenir un avis par id' })
  @ApiResponse({ status: 200, description: 'Avis trouvé' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un avis (connecté)' })
  @ApiResponse({ status: 201, description: 'Avis créé' })
  create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    return this.reviewsService.create(createReviewDto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un avis (propriétaire ou admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @Request() req,
  ) {
    return this.reviewsService.update(id, updateReviewDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un avis (propriétaire ou admin)' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.reviewsService.remove(id, req.user.id, req.user.role);
  }
}
