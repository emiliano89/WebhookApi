import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChannelContactEntity } from './channel-contact.entity';

@Injectable()
export class ChannelContactsService {
  constructor(
    @InjectRepository(ChannelContactEntity)
    private readonly repository: Repository<ChannelContactEntity>,
  ) {}

  async findByChannelAndExternalId(
    channelId: string,
    externalId: string,
  ): Promise<ChannelContactEntity | null> {
    return this.repository.findOne({
      where: {
        channelId,
        externalId,
      },
    });
  }
}