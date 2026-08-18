export interface NormalizedWebhookEvent {
  channel: string;
  type: 'MESSAGE' | 'STATUS';
  externalUserId?: string;
  externalMessageId: string;
  text?: string;
  timestamp: Date;
  status?: string;

  metadata?: {
    phoneNumberId?: string;
    displayPhoneNumber?: string;
    displayName?: string;
  };
}
