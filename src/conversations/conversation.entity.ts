import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  schema: 'chatbot',
  name: 'conversations',
})
export class ConversationEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'business_id', type: 'bigint' })
  businessId!: string;

  @Column({ name: 'customer_id', type: 'bigint' })
  customerId!: string;

  @Column({ name: 'channel_id', type: 'bigint' })
  channelId!: string;

  @Column({
    length: 30,
    default: 'OPEN',
  })
  status!: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @Column({
    name: 'closed_at',
    type: 'timestamp',
    nullable: true,
  })
  closedAt?: Date;
}