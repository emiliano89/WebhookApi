import { Module } from '@nestjs/common';

import { AiService } from './ai.service';
import { MessagesModule } from '../messages/messages.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [
    MessagesModule,
    ServicesModule,
  ],
  providers: [
    AiService,
  ],
  exports: [
    AiService,
  ],
})
export class AiModule {}