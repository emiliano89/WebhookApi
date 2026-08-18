import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  schema: 'chatbot',
  name: 'channels',
})
export class ChannelEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'business_id', type: 'bigint' })
  businessId!: string;

  @Column({ length: 30 })
  type!: string;

  @Column({ name: 'external_id', length: 255 })
  externalId!: string;

  @Column({ length: 100, nullable: true })
  name?: string;

  @Column({ default: true })
  active!: boolean;
}