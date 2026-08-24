import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderEntity } from './order.entity';
import { OrderItemEntity } from './order-item.entity';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderItemEntity,
    ]),
  ],
  providers: [
    OrdersService,
  ],
  exports: [
    OrdersService,
  ],
})
export class OrdersModule {}