import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { CustomersService } from '../../src/customers/customers.service';
import { CustomerEntity } from '../../src/customers/customer.entity';
import { ChannelContactEntity } from '../../src/channel-contacts/channel-contact.entity';

describe('CustomersService', () => {
  let service: CustomersService;
  let mockDataSource: any;
  let mockManager: any;

  beforeEach(async () => {
    mockManager = {
      getRepository: jest.fn(),
    };

    mockDataSource = {
      transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOrCreate', () => {
    it('should return existing customer if contact found', async () => {
      const mockContact = {
        channelId: '100',
        customerId: '200',
        externalId: 'ext-user-123',
      };

      const mockCustomer = {
        id: '200',
        businessId: '50',
        name: 'John Doe',
      };

      const mockContactRepository = {
        findOne: jest.fn().mockResolvedValue(mockContact),
        create: jest.fn(),
        save: jest.fn(),
      };

      const mockCustomerRepository = {
        findOneBy: jest.fn().mockResolvedValue(mockCustomer),
        create: jest.fn(),
        save: jest.fn(),
      };

      mockManager.getRepository = jest.fn((entity) => {
        if (entity === ChannelContactEntity) {
          return mockContactRepository;
        }
        if (entity === CustomerEntity) {
          return mockCustomerRepository;
        }
      });

      mockDataSource.transaction.mockImplementation((callback) =>
        callback(mockManager),
      );

      const result = await service.findOrCreate('50', '100', 'ext-user-123', 'John Doe');

      expect(result).toEqual(mockCustomer);
      expect(mockContactRepository.findOne).toHaveBeenCalled();
      expect(mockCustomerRepository.findOneBy).toHaveBeenCalled();
      expect(mockCustomerRepository.create).not.toHaveBeenCalled();
    });

    it('should create new customer if contact not found', async () => {
      const newCustomer = {
        businessId: '50',
        name: 'Jane Doe',
      };

      const savedCustomer = {
        id: '300',
        ...newCustomer,
      };

      const newContact = {
        channelId: '100',
        customerId: '300',
        externalId: 'new-ext-user',
        displayName: 'Jane Doe',
      };

      const mockContactRepository = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockReturnValue(newContact),
        save: jest.fn().mockResolvedValue(newContact),
      };

      const mockCustomerRepository = {
        create: jest.fn().mockReturnValue(newCustomer),
        save: jest.fn().mockResolvedValue(savedCustomer),
        findOneBy: jest.fn(),
      };

      mockManager.getRepository = jest.fn((entity) => {
        if (entity === ChannelContactEntity) {
          return mockContactRepository;
        }
        if (entity === CustomerEntity) {
          return mockCustomerRepository;
        }
      });

      mockDataSource.transaction.mockImplementation((callback) =>
        callback(mockManager),
      );

      const result = await service.findOrCreate('50', '100', 'new-ext-user', 'Jane Doe');

      expect(result).toEqual(savedCustomer);
      expect(mockCustomerRepository.create).toHaveBeenCalledWith({
        businessId: '50',
        name: 'Jane Doe',
      });
      expect(mockCustomerRepository.save).toHaveBeenCalledWith(newCustomer);
      expect(mockContactRepository.create).toHaveBeenCalledWith({
        channelId: '100',
        customerId: '300',
        externalId: 'new-ext-user',
        displayName: 'Jane Doe',
      });
      expect(mockContactRepository.save).toHaveBeenCalledWith(newContact);
    });

    it('should throw error if customer not found in database', async () => {
      const mockContact = {
        channelId: '100',
        customerId: 'non-existent-customer',
        externalId: 'ext-user-123',
      };

      const mockContactRepository = {
        findOne: jest.fn().mockResolvedValue(mockContact),
        create: jest.fn(),
        save: jest.fn(),
      };

      const mockCustomerRepository = {
        findOneBy: jest.fn().mockResolvedValue(null),
        create: jest.fn(),
        save: jest.fn(),
      };

      mockManager.getRepository = jest.fn((entity) => {
        if (entity === ChannelContactEntity) {
          return mockContactRepository;
        }
        if (entity === CustomerEntity) {
          return mockCustomerRepository;
        }
      });

      mockDataSource.transaction.mockImplementation((callback) =>
        callback(mockManager),
      );

      await expect(
        service.findOrCreate('50', '100', 'ext-user-123', 'John Doe'),
      ).rejects.toThrow(`Customer non-existent-customer not found`);
    });
  });
});
