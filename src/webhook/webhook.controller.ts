import { Body, Controller, Param, Post } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WhatsAppWebhookDto } from './dto/whatsapp-webhook.dto';

@Controller('webhooks')
export class WebhookController {

  constructor(private readonly webhookService: WebhookService) {}

  @Post(':channel')
  receive(
    @Param('channel') channel: string,
    @Body() body: WhatsAppWebhookDto,
  ) {
    return this.webhookService.process(channel, body);
  }
}