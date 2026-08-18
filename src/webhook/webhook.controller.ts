import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import express from 'express';
import { WebhookService } from './webhook.service';
import { WebhookDto } from './channels/whatsapp/dto/webhook.dto';

@Controller('webhooks')
export class WebhookController {

  constructor(private readonly webhookService: WebhookService) { }

  @Post(':channel')
  receive(
    @Param('channel') channel: string,
    @Body() body: WebhookDto,
  ) {
    return this.webhookService.process(channel, body);
  }

  @Get()
  verifyWebhook(@Query() query: any, @Res() res: express.Response) {
    //const mode = query['hub.mode'];
    //const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    //if (mode === 'subscribe' && token === 'YOUR_VERIFY_TOKEN') {
      return res.status(200).send(challenge);
    //}
    //return res.sendStatus(403);
  }
}