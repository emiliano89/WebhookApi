import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  schema: 'chatbot',
  name: 'messages',
})
export class MessageEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({
    name: 'conversation_id',
    type: 'bigint',
  })
  conversationId!: string;

  @Column({
    name: 'channel_id',
    type: 'bigint',
  })
  channelId!: string;

  @Column({
    name: 'external_message_id',
    length: 255,
  })
  externalMessageId!: string;

  @Column({
    length: 20,
  })
  role!: string;

  @Column({
    type: 'text',
  })
  content!: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}