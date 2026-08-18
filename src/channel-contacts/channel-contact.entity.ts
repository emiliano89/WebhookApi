import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  schema: 'chatbot',
  name: 'channel_contacts',
})
export class ChannelContactEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'channel_id', type: 'bigint' })
  channelId!: string;

  @Column({ name: 'customer_id', type: 'bigint' })
  customerId!: string;

  @Column({ name: 'external_id', length: 255 })
  externalId!: string;

  @Column({
    name: 'display_name',
    length: 150,
    nullable: true,
  })
  displayName?: string;
}