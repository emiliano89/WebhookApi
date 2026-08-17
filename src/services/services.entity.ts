import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  schema: 'chatbot',
  name: 'services',
})
export class ServiceEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({
    name: 'business_id',
    type: 'bigint',
  })
  businessId!: string;

  @Column({
    length: 150,
  })
  name!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  price?: string;

  @Column({
    name: 'duration_minutes',
    type: 'integer',
    nullable: true,
  })
  durationMinutes?: number;

  @Column({
    default: true,
  })
  active!: boolean;
}