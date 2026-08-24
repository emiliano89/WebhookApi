import { Module } from '@nestjs/common';

import { AiService } from './ai.service';
import { MessagesModule } from '../messages/messages.module';
import { ServicesModule } from '../services/services.module';
import { ProductsModule } from '../products/products.module';
import { AiToolsService } from './tools/ai-tools.service';

@Module({
  imports: [
    MessagesModule,
    ServicesModule,
    ProductsModule,
  ],
  providers: [
    AiService,
    AiToolsService,
  ],
  exports: [
    AiService,
  ],
})
export class AiModule {}