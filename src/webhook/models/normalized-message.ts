export interface NormalizedMessage {
  channel: string;
  type: 'MESSAGE' | 'STATUS';
  externalUserId: string;
  externalMessageId: string;
  text: string;
  timestamp: Date;
  metadata?: {
    phoneNumberId?: string;
    displayPhoneNumber?: string;
  };
}