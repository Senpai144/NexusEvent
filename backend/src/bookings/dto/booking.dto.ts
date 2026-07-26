import {
  IsString,
  IsEmail,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod, BookingStatus } from '../../entities/booking.entity';

export class CreateBookingDto {
  @ApiProperty({ example: 'Jean' })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ example: 'Dupont' })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ example: 'jean@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+221 77 123 45 67' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  numberOfSeats: number;

  @ApiPropertyOptional({ enum: PaymentMethod, default: PaymentMethod.WAVE })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({ example: 'Merci pour cet événement !' })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ example: 'event-uuid' })
  @IsString()
  eventId: string;

  @ApiPropertyOptional({ example: 'user-uuid' })
  @IsString()
  @IsOptional()
  userId?: string;
}

export class UpdateBookingDto {
  @ApiPropertyOptional({ enum: BookingStatus })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiPropertyOptional({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;
}
