import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServiceEntity } from './services.entity';
import { ServicesService } from './services.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceEntity]),
  ],
  providers: [
    ServicesService,
  ],
  exports: [
    ServicesService,
  ],
})
export class ServicesModule {}