import { IsString, IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../entities/user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Jean Dupont' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'jean@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional()
  @IsOptional()
  isActive?: boolean;
}
