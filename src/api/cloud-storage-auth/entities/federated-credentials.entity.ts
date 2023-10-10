import { Base } from 'src/api/base.entity';
import { User } from 'src/api/user/entities/user.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';

@Entity()
@Unique(['provider', 'user'])
export class FederatedKeys extends Base {
  @Column()
  provider: string;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column({ type: 'bigint' })
  expiry_date: string;

  @ManyToOne(() => User)
  user: User;
}
