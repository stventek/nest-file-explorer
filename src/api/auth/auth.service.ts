import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from '../user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FederatedCredentials } from './entities/federated-credentials.entity';

/*TODO: add restrictions for email duplication and account liking */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(FederatedCredentials)
    private readonly federatedCredentailsRepository: Repository<FederatedCredentials>,
    private dataSource: DataSource,
  ) {}

  async signIn(user: CreateAuthDto) {
    const userExists = await this.federatedCredentailsRepository.findOne({
      where: { subject: user.id },
      relations: ['user'],
    });

    if (userExists) {
      const updateUser = userExists.user;
      updateUser.lastLoginAt = new Date();
      this.userRepository.save(updateUser);
      return userExists;
    }
    return this.registerUser(user);
  }

  async registerUser(user: CreateAuthDto) {
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
}
