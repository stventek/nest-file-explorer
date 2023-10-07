import { Exclude } from 'class-transformer';
import { Base } from 'src/api/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends Base {
  @Column()
  email: string;

  @Exclude()
  @Column({ nullable: true, default: null })
  password: string;

  @Column()
  username: string;

  @Column()
  name: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  lastLoginAt: Date | null;
}
