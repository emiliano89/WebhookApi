import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { ChannelAdapter } from '../../shared/adapters/channel.adapter';
import { WebhookDto } from './dto/webhook.dto';
import {
  NormalizedWebhookEvent,
} from '../../shared/models/normalized-webhook-event';

@Injectable()
export class WhatsAppAdapter implements ChannelAdapter {

  normalize(payload: unknown): NormalizedWebhookEvent {
    const webhook = payload as WebhookDto;

    const value =
      webhook.entry?.[0]?.changes?.[0]?.value;

    if (!value) {
      throw new BadRequestException(
        'Invalid WhatsApp webhook payload',
      );
    }

    if (value.messages?.length) {
      return this.normalizeMessage(value);
    }

    if (value.statuses?.length) {
      return this.normalizeStatus(value);
    }

    throw new BadRequestException(
      'Unsupported WhatsApp webhook event',
    );
  }

private normalizeMessage(
  value: WebhookDto['entry'][number]['changes'][number]['value'],
): NormalizedWebhookEvent {

  const message = value.messages![0];

  if (message.type !== 'text' || !message.text) {
    throw new BadRequestException(
      `Unsupported WhatsApp message type: ${message.type}`,
    );
  }

  return {
    channel: 'WHATSAPP',
    type: 'MESSAGE',
    externalUserId: message.from,
    externalMessageId: message.id,
    text: message.text.body,
    timestamp: new Date(
      Number(message.timestamp) * 1000,
    ),
    metadata: {
      phoneNumberId: value.metadata.phone_number_id,
      displayPhoneNumber:
        value.metadata.display_phone_number,
      displayName:
        value.contacts?.[0]?.profile?.name,
    },
  };
}

  private normalizeStatus(
    value: WebhookDto['entry'][number]['changes'][number]['value'],
  ): NormalizedWebhookEvent {

    const status = value.statuses![0];

    return {
      channel: 'WHATSAPP',
      type: 'STATUS',
      externalMessageId: status.id,
      timestamp: new Date(
        Number(status.timestamp) * 1000,
      ),
      status: status.status,
      metadata: {
        phoneNumberId: value.metadata.phone_number_id,
        displayPhoneNumber:
          value.metadata.display_phone_number,
      },
    };
  }
}
