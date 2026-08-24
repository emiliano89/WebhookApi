import { Injectable } from '@nestjs/common';

import { ServicesService } from '../../services/services.service';

@Injectable()
export class AiToolsService {

  constructor(
    private readonly servicesService: ServicesService,
  ) {}

  async getService(
    businessId: string,
    serviceName: string,
  ) {
    const services =
      await this.servicesService.findActiveByBusiness(
        businessId,
      );

    const service = services.find(
      (item) =>
        item.name.toLowerCase() ===
        serviceName.toLowerCase(),
    );

    if (!service) {
      return {
        found: false,
        message: 'Servicio no encontrado',
      };
    }

    return {
      found: true,
      service: {
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        durationMinutes: service.durationMinutes,
      },
    };
  }
}