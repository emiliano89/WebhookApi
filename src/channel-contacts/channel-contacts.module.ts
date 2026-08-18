import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChannelContactEntity } from './channel-contact.entity';
import { ChannelContactsService } from './channel-contacts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelContactEntity]),
  ],
  providers: [
    ChannelContactsService,
  ],
  exports: [
    ChannelContactsService,
  ],
})
export class ChannelContactsModule {}