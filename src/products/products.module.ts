import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductEntity } from './products.entity';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
  ],
  providers: [
    ProductsService,
  ],
  exports: [
    ProductsService,
  ],
})
export class ProductsModule {}