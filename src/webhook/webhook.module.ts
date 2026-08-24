import { Module } from '@nestjs/common';

import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { WhatsAppAdapter } from './channels/whatsapp/whatsapp.adapter';
import { ChannelRegistryService } from './registry/channel-registry.service';

import { ChannelsModule } from '../channels/channels.module';
import { CustomersModule } from '../customers/customers.module';
import { ConversationsModule } from '../conversations/conversation.module';
import { MessagesModule } from '../messages/messages.module';
import { AiModule } from '../ai/ai.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    ChannelsModule,
    CustomersModule,
    ConversationsModule,
    MessagesModule,
    AiModule,
    OrdersModule,
  ],
  controllers: [
    WebhookController,
  ],
  providers: [
    WebhookService,
    WhatsAppAdapter,
    ChannelRegistryService,
  ],
})
export class WebhookModule {}