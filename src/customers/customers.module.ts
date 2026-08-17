import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerEntity } from './customer.entity';
import { ChannelContactEntity } from '../channel-contacts/channel-contact.entity';
import { CustomersService } from './customers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerEntity,
      ChannelContactEntity,
    ]),
  ],
  providers: [
    CustomersService,
  ],
  exports: [
    CustomersService,
  ],
})
export class CustomersModule {}