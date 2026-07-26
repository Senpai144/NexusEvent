import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants incorrects');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Compte désactivé');
    }
    return { id: user.id, email: user.email, role: user.role, name: user.name };
  }
}
