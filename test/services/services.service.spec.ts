import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServicesService } from '../../src/services/services.service';
import { ServiceEntity } from '../../src/services/services.entity';

describe('ServicesService', () => {
  let service: ServicesService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: getRepositoryToken(ServiceEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findActiveByBusiness', () => {
    it('should return active services sorted by name', async () => {
      const mockServices = [
        {
          id: '1',
          businessId: '100',
          name: 'Service A',
          active: true,
          price: '100.00',
        },
        {
          id: '2',
          businessId: '100',
          name: 'Service B',
          active: true,
          price: '200.00',
        },
      ];

      mockRepository.find.mockResolvedValue(mockServices);

      const result = await service.findActiveByBusiness('100');

      expect(result).toEqual(mockServices);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          businessId: '100',
          active: true,
        },
        order: {
          name: 'ASC',
        },
      });
    });

    it('should return empty array if no active services', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findActiveByBusiness('100');

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });
});
