import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  schema: 'chatbot',
  name: 'products',
})
export class ProductEntity {
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
    default: true,
  })
  active!: boolean;
}