import { Injectable, NotFoundException } from '@nestjs/common';
import { ChannelAdapter } from '../shared/adapters/channel.adapter';
import { WhatsAppAdapter } from '../channels/whatsapp/whatsapp.adapter';

@Injectable()
export class ChannelRegistryService {

  private readonly adapters: Map<string, ChannelAdapter>;

  constructor(
    private readonly whatsappAdapter: WhatsAppAdapter,
  ) {
    this.adapters = new Map([
      ['whatsapp', this.whatsappAdapter],
    ]);
  }

  getAdapter(channel: string): ChannelAdapter {
    const adapter = this.adapters.get(channel.toLowerCase());

    if (!adapter) {
      throw new NotFoundException(
        `Unsupported channel: ${channel}`,
      );
    }

    return adapter;
  }
}