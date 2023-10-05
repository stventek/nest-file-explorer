import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from './services/typeorm/typeorm.service';

@Module({
  providers: [TypeOrmConfigService],
})
export class SharedModule {}
