import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventCategory, EventStatus } from '../../entities/event.entity';

export class CreateEventDto {
  @ApiProperty({ example: 'Africa Tech Summit 2026' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: 'Un sommet technologique réunissant les innovateurs africains...' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2026-07-15' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: '09:00' })
  @IsString()
  @IsOptional()
  time?: string;

  @ApiPropertyOptional({ example: '8h' })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiProperty({ example: 'Dakar, Sénégal' })
  @IsString()
  location: string;

  @ApiPropertyOptional({ enum: EventCategory, default: EventCategory.TECHNOLOGIE })
  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @ApiPropertyOptional({ enum: EventStatus, default: EventStatus.UPCOMING })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(1)
  maxParticipants: number;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-xxx' })
  @IsString()
  @IsOptional()
  cover?: string;
}

export class UpdateEventDto {
  @ApiPropertyOptional({ example: 'Africa Tech Summit 2026' })
  @IsString()
  @MinLength(3)
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Un sommet technologique réunissant les innovateurs africains...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '2026-07-15' })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({ example: '09:00' })
  @IsString()
  @IsOptional()
  time?: string;

  @ApiPropertyOptional({ example: '8h' })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiPropertyOptional({ example: 'Dakar, Sénégal' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ enum: EventCategory })
  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @ApiPropertyOptional({ enum: EventStatus })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @ApiPropertyOptional({ example: 5000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 150 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  maxParticipants?: number;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-xxx' })
  @IsString()
  @IsOptional()
  cover?: string;

  @ApiPropertyOptional({ example: 50 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  participants?: number;
}
