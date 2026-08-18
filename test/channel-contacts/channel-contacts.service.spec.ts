import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChannelContactsService } from '../../src/channel-contacts/channel-contacts.service';
import { ChannelContactEntity } from '../../src/channel-contacts/channel-contact.entity';

describe('ChannelContactsService', () => {
  let service: ChannelContactsService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelContactsService,
        {
          provide: getRepositoryToken(ChannelContactEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ChannelContactsService>(ChannelContactsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByChannelAndExternalId', () => {
    it('should return channel contact if found', async () => {
      const mockContact = {
        id: '1',
        channelId: '100',
        customerId: '200',
        externalId: 'ext-user-123',
        displayName: 'John Doe',
      };

      mockRepository.findOne.mockResolvedValue(mockContact);

      const result = await service.findByChannelAndExternalId('100', 'ext-user-123');

      expect(result).toEqual(mockContact);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          channelId: '100',
          externalId: 'ext-user-123',
        },
      });
    });

    it('should return null if contact not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByChannelAndExternalId('100', 'non-existent');

      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalled();
    });

    it('should search by both channelId and externalId', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await service.findByChannelAndExternalId('channel-1', 'user-ext-id');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          channelId: 'channel-1',
          externalId: 'user-ext-id',
        },
      });
    });
  });
});
