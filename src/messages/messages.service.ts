import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import crypto from 'node:crypto';

import { MessageEntity } from './message.entity';

@Injectable()
export class MessagesService {

  constructor(
    @InjectRepository(MessageEntity)
    private readonly repository:
      Repository<MessageEntity>,
  ) {}

async findRecentByConversation(
  conversationId: string,
  limit = 20,
): Promise<MessageEntity[]> {
  const messages = await this.repository
    .createQueryBuilder('message')
    .where('message.conversation_id = :conversationId', {
      conversationId,
    })
    .orderBy('message.created_at', 'DESC')
    .take(limit)
    .getMany();

  return messages.reverse();
}


async saveUserMessage(
  conversationId: string,
  channelId: string,
  externalMessageId: string,
  content: string,
): Promise<MessageEntity> {

  const existing = await this.repository.findOne({
    where: {
      channelId,
      externalMessageId,
    },
  });

  if (existing) {
    return existing;
  }

  const message = this.repository.create({
    conversationId,
    channelId,
    externalMessageId,
    role: 'USER',
    content,
  });

  return this.repository.save(message);
}

async saveAssistantMessage(
  conversationId: string,
  channelId: string,
  content: string,
): Promise<MessageEntity> {

  const message = this.repository.create({
    conversationId,
    channelId,
    externalMessageId: `internal-${crypto.randomUUID()}`,
    role: 'ASSISTANT',
    content,
  });

  return this.repository.save(message);
}
}