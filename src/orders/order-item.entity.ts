import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  schema: 'chatbot',
  name: 'order_items',
})
export class OrderItemEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({
    name: 'order_id',
    type: 'bigint',
  })
  orderId!: string;

  @Column({
    name: 'product_id',
    type: 'bigint',
    nullable: true,
  })
  productId?: string;

  @Column({
    name: 'service_id',
    type: 'bigint',
    nullable: true,
  })
  serviceId?: string;

  @Column({
    type: 'integer',
    default: 1,
  })
  quantity!: number;

  @Column({
    name: 'unit_price',
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  unitPrice!: string;
}