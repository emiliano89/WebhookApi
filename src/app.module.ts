import { Module } from '@nestjs/common';
import { WebhookController } from './webhook/webhook.controller';
import { WebhookService } from './webhook/webhook.service';
import { WebhookModule } from './webhook/webhook.module';
import { WhatsAppAdapter } from './webhook/adapters/whatsapp.adapter';

@Module({
  imports: [WebhookModule],
  controllers: [WebhookController],
  providers: [WebhookService, WhatsAppAdapter],
})
export class AppModule {}
