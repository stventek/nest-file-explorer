import { Base } from 'src/api/base.entity';
import { User } from 'src/api/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class FederatedCredentials extends Base {
  @Column()
  provider: string;

  @Column()
  subject: string;

  @ManyToOne(() => User)
  user: User;
}
