import { NormalizedWebhookEvent } from '../models/normalized-webhook-event';

export interface ChannelAdapter {
  normalize(payload: unknown): NormalizedWebhookEvent;
}
