import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LocalLoginDto } from '../../dto/local-login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/api/user/entities/user.entity';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';

@Injectable()
export class AuthLocalService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(user: LocalLoginDto) {
    const foundUser = await this.findByEmail(user.email);

    if (
      !foundUser ||
      foundUser.password === null ||
      !(await compare(user.password, foundUser.password))
    ) {
      throw new UnauthorizedException('Incorrect username or password');
    }

    return foundUser;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException(`No user found with email ${email}`);
    }
    return user;
  }
}
