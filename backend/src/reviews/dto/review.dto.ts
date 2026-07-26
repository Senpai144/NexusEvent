import { IsString, IsNumber, IsOptional, Min, Max, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 'Excellent événement !' })
  @IsString()
  @MinLength(3)
  text: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Passionné de Technologie' })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  eventId?: string;
}

export class UpdateReviewDto {
  @ApiPropertyOptional({ example: 'Excellent événement !' })
  @IsString()
  @MinLength(3)
  @IsOptional()
  text?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;
}
