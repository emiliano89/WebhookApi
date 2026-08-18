import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductEntity } from './products.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  async findActiveByBusiness(
    businessId: string,
  ): Promise<ProductEntity[]> {
    return this.repository.find({
      where: {
        businessId,
        active: true,
      },
      order: {
        name: 'ASC',
      },
    });
  }
}