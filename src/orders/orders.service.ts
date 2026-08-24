import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { OrderEntity } from './order.entity';
import { OrderItemEntity } from './order-item.entity';

interface CreateOrderItem {
  productId?: string;
  serviceId?: string;
  quantity: number;
  unitPrice: string;
}

@Injectable()
export class OrdersService {

  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async createOrder(
    businessId: string,
    customerId: string,
    items: CreateOrderItem[],
  ): Promise<OrderEntity> {

    return this.dataSource.transaction(async (manager) => {
      const orderRepository =
        manager.getRepository(OrderEntity);

      const itemRepository =
        manager.getRepository(OrderItemEntity);

      const total = items.reduce(
        (sum, item) =>
          sum + Number(item.unitPrice) * item.quantity,
        0,
      );

      const order = orderRepository.create({
        businessId,
        customerId,
        status: 'PENDING',
        total: total.toFixed(2),
      });

      const savedOrder =
        await orderRepository.save(order);

      const orderItems = items.map((item) =>
        itemRepository.create({
          orderId: savedOrder.id,
          productId: item.productId,
          serviceId: item.serviceId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        }),
      );

      await itemRepository.save(orderItems);

      return savedOrder;
    });
  }
}