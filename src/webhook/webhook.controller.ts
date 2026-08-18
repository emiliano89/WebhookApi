import { Body, Controller, Param, Post } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookDto } from './channels/whatsapp/dto/webhook.dto';

@Controller('webhooks')
export class WebhookController {

  constructor(private readonly webhookService: WebhookService) {}

  @Post(':channel')
  receive(
    @Param('channel') channel: string,
    @Body() body: WebhookDto,
  ) {
    return this.webhookService.process(channel, body);
  }
}