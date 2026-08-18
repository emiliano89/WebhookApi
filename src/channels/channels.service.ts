import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChannelEntity } from './channel.entity';

@Injectable()
export class ChannelsService {

  constructor(
    @InjectRepository(ChannelEntity)
    private readonly channelRepository: Repository<ChannelEntity>,
  ) {}

  async findByExternalId(
    type: string,
    externalId: string,
  ): Promise<ChannelEntity | null> {

    return this.channelRepository.findOne({
      where: {
        type,
        externalId,
        active: true,
      },
    });
  }
}