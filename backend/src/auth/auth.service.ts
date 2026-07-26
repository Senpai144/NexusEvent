import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email.toLowerCase() },
    });
    if (existingUser) {
      throw new ConflictException('Un compte avec cet email existe déjà');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.usersRepository.create({
      ...registerDto,
      email: registerDto.email.toLowerCase(),
      password: hashedPassword,
    });
    const savedUser = await this.usersRepository.save(user);

    const payload = { sub: savedUser.id, email: savedUser.email, role: savedUser.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email.toLowerCase() },
    });
    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    return result;
  }

  async seedAdmin() {
    const adminExists = await this.usersRepository.findOne({
      where: { role: 'admin' as any },
    });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = this.usersRepository.create({
        name: 'Admin User',
        email: 'admin@nexusevent.com',
        password: hashedPassword,
        role: 'admin' as any,
      });
      await this.usersRepository.save(admin);
      console.log('Admin user created: admin@nexusevent.com / admin123');
    }
  }
}
