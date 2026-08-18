import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConversationEntity } from './conversation.entity';

@Injectable()
export class ConversationsService {

  constructor(
    @InjectRepository(ConversationEntity)
    private readonly repository:
      Repository<ConversationEntity>,
  ) {}

  async findOrCreate(
    businessId: string,
    customerId: string,
    channelId: string,
  ): Promise<ConversationEntity> {

    const existing =
      await this.repository.findOne({
        where: {
          businessId,
          customerId,
          channelId,
          status: 'OPEN',
        },
      });

    if (existing) {
      return existing;
    }

    const conversation =
      this.repository.create({
        businessId,
        customerId,
        channelId,
        status: 'OPEN',
      });

    return this.repository.save(conversation);
  }
}