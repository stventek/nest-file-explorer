import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/api/user/entities/user.entity';
import { FederatedCredentials } from '../../entities/federated-credentials.entity';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

/*TODO: add restrictions for email duplication and account liking */
@Injectable()
export class GoogleAuthV2Service {
  client = new OAuth2Client();

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(FederatedCredentials)
    private readonly federatedCredentailsRepository: Repository<FederatedCredentials>,
    private dataSource: DataSource,
    private config: ConfigService,
  ) {}

  async validateIdToken(token: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.config.get<string>('GOOGLE_CLIENT_ID'),
      });
      return ticket.getPayload();
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  async signIn(idToken: string) {
    const payload = await this.validateIdToken(idToken);
    const userExists = await this.federatedCredentailsRepository.findOne({
      where: { subject: payload.sub },
      relations: ['user'],
    });

    if (userExists) {
      const updateUser = userExists.user;
      updateUser.lastLoginAt = new Date();
      this.userRepository.save(updateUser);
      return userExists.user;
    }
    return this.registerUser(payload);
  }

  async registerUser(payload: TokenPayload) {
    const newUser = this.userRepository.create({
      username: payload.name,
      email: payload.email,
      name: payload.name,
      lastLoginAt: new Date(),
    });
    await this.dataSource.transaction(async (manager) => {
      await manager.save(newUser);
      const newFederatedCredentials =
        this.federatedCredentailsRepository.create({
          provider: 'google',
          subject: payload.sub,
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
