import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ServiceEntity } from './services.entity';

@Injectable()
export class ServicesService {

  constructor(
    @InjectRepository(ServiceEntity)
    private readonly repository: Repository<ServiceEntity>,
  ) {}

  async findActiveByBusiness(
    businessId: string,
  ): Promise<ServiceEntity[]> {
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