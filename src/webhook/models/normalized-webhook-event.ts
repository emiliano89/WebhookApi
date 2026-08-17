export type WebhookEventType = 'MESSAGE' | 'STATUS';

export interface NormalizedWebhookEvent {
  channel: string;
  type: WebhookEventType;
  externalUserId?: string;
  externalMessageId: string;
  text?: string;
  timestamp: Date;
  status?: string;
  metadata?: {
    phoneNumberId?: string;
    displayPhoneNumber?: string;
  };
}