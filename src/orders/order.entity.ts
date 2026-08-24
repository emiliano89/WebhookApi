import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  schema: 'chatbot',
  name: 'orders',
})
export class OrderEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({
    name: 'business_id',
    type: 'bigint',
  })
  businessId!: string;

  @Column({
    name: 'customer_id',
    type: 'bigint',
  })
  customerId!: string;

  @Column({
    length: 50,
    default: 'PENDING',
  })
  status!: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
  })
  total!: string;

  @Column({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}