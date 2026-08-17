import { Injectable } from '@nestjs/common';
import { ChannelRegistryService } from './registry/channel-registry.service';

@Injectable()
export class WebhookService {

  constructor(private readonly channelRegistryService: ChannelRegistryService) {}

 process(channel: string, body: any) {

      const adapter = this.channelRegistryService.getAdapter(channel);

      const message = adapter.normalize(body);

      console.log('Normalized message:', message);

      return message;
  }
}