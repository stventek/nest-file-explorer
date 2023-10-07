import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/api/user/entities/user.entity';
import { FederatedCredentials } from '../../entities/federated-credentials.entity';
import { GoogleLoginDto } from '../../dto/google-login.dto';

/*TODO: add restrictions for email duplication and account liking */
@Injectable()
export class AuthGoogleService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(FederatedCredentials)
    private readonly federatedCredentailsRepository: Repository<FederatedCredentials>,
    private dataSource: DataSource,
  ) {}

  async signIn(user: GoogleLoginDto) {
    const userExists = await this.federatedCredentailsRepository.findOne({
      where: { subject: user.id },
      relations: ['user'],
    });

    if (userExists) {
      const updateUser = userExists.user;
      updateUser.lastLoginAt = new Date();
      this.userRepository.save(updateUser);
      return userExists.user;
    }
    return this.registerUser(user);
  }

  async registerUser(user: GoogleLoginDto) {
    const newUser = this.userRepository.create({
      username: user.name,
      email: user.email,
      name: user.name,
      lastLoginAt: new Date(),
    });
    await this.dataSource.transaction(async (manager) => {
      await manager.save(newUser);
      const newFederatedCredentials =
        this.federatedCredentailsRepository.create({
          provider: user.provider,
          subject: user.id,
          user: newUser,
        });
      await manager.save(newFederatedCredentials);
    });
    return newUser;
  }

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException(`No user found with id ${id}`);
    }
    return user;
  }
}
