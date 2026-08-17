import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  schema: 'chatbot',
  name: 'customers',
})
export class CustomerEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'business_id', type: 'bigint' })
  businessId!: string;

  @Column({ length: 150, nullable: true })
  name?: string;

  @Column({ length: 150, nullable: true })
  email?: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}