import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ChannelRegistryService } from './registry/channel-registry.service';
import { ChannelsService } from '../channels/channels.service';
import { CustomersService } from '../customers/customers.service';
import { ConversationsService } from '../conversations/conversations.service';
import { MessagesService } from '../messages/messages.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class WebhookService {

  constructor(
    private readonly channelRegistry:
      ChannelRegistryService,

    private readonly channelsService:
      ChannelsService,

    private readonly customersService:
      CustomersService,

    private readonly conversationsService:
      ConversationsService,

    private readonly messagesService:
      MessagesService,

    private readonly aiService:
      AiService,
  ) { }

  async process(
    channel: string,
    body: unknown,
  ) {
    const adapter =
      this.channelRegistry.getAdapter(channel);

    const event =
      adapter.normalize(body);

    if (event.type !== 'MESSAGE') {
      return {
        received: true,
        type: event.type,
      };
    }

    if (!event.externalUserId) {
      throw new BadRequestException(
        'External user ID not found',
      );
    }

    if (!event.metadata?.phoneNumberId) {
      throw new BadRequestException(
        'Channel external ID not found',
      );
    }

    if (!event.text) {
      throw new BadRequestException(
        'Message text not found',
      );
    }

    const channelEntity =
      await this.channelsService.findByExternalId(
        event.channel,
        event.metadata.phoneNumberId,
      );

    if (!channelEntity) {
      throw new NotFoundException(
        `Channel not found: ${event.metadata.phoneNumberId}`,
      );
    }

    const customer =
      await this.customersService.findOrCreate(
        channelEntity.businessId,
        channelEntity.id,
        event.externalUserId,
        event.metadata.displayName,
      );

    const conversation =
      await this.conversationsService.findOrCreate(
        channelEntity.businessId,
        customer.id,
        channelEntity.id,
      );

    const message =
      await this.messagesService.saveUserMessage(
        conversation.id,
        channelEntity.id,
        event.externalMessageId,
        event.text,
    );

const response =
  await this.aiService.generateResponse(
    conversation.id,
    channelEntity.businessId,
  );
  
  const assistantMessage =
  await this.messagesService.saveAssistantMessage(
    conversation.id,
    channelEntity.id,
    response,
  );

    return {
      received: true,
      businessId: channelEntity.businessId,
      customerId: customer.id,
      conversationId: conversation.id,
      messageId: message.id,
      assistantMessageId: assistantMessage.id,
      response,
    };
  }
}