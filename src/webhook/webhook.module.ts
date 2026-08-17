import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { WhatsAppAdapter } from './adapters/whatsapp.adapter';
import { ChannelRegistryService } from './registry/channel-registry.service';


@Module({
  controllers: [WebhookController],
  providers: [
    WebhookService,
    WhatsAppAdapter,
    ChannelRegistryService,
  ],
})
export class WebhookModule {}