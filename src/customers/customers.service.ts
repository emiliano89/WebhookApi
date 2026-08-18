import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { CustomerEntity } from './customer.entity';
import { ChannelContactEntity } from '../channel-contacts/channel-contact.entity';

@Injectable()
export class CustomersService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async findOrCreate(
    businessId: string,
    channelId: string,
    externalUserId: string,
    displayName?: string,
  ): Promise<CustomerEntity> {

    return this.dataSource.transaction(
      async (manager) => {

        const contactRepository =
          manager.getRepository(ChannelContactEntity);

        const customerRepository =
          manager.getRepository(CustomerEntity);

        const existingContact =
          await contactRepository.findOne({
            where: {
              channelId,
              externalId: externalUserId,
            },
          });

        if (existingContact) {
          const customer =
            await customerRepository.findOneBy({
              id: existingContact.customerId,
            });

          if (!customer) {
            throw new Error(
              `Customer ${existingContact.customerId} not found`,
            );
          }

          return customer;
        }

        const customer =
          customerRepository.create({
            businessId,
            name: displayName,
          });

        const savedCustomer =
          await customerRepository.save(customer);

        const contact =
          contactRepository.create({
            channelId,
            customerId: savedCustomer.id,
            externalId: externalUserId,
            displayName,
          });

        await contactRepository.save(contact);

        return savedCustomer;
      },
    );
  }
}