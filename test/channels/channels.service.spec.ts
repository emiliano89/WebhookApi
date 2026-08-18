import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChannelsService } from '../../src/channels/channels.service';
import { ChannelEntity } from '../../src/channels/channel.entity';

describe('ChannelsService', () => {
  let service: ChannelsService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelsService,
        {
          provide: getRepositoryToken(ChannelEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ChannelsService>(ChannelsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByExternalId', () => {
    it('should return channel if found with active status', async () => {
      const mockChannel = {
        id: '1',
        businessId: '100',
        type: 'whatsapp',
        externalId: 'phone-123',
        name: 'My Channel',
        active: true,
      };

      mockRepository.findOne.mockResolvedValue(mockChannel);

      const result = await service.findByExternalId('whatsapp', 'phone-123');

      expect(result).toEqual(mockChannel);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          type: 'whatsapp',
          externalId: 'phone-123',
          active: true,
        },
      });
    });

    it('should return null if channel not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByExternalId('whatsapp', 'non-existent');

      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalled();
    });

    it('should only find active channels', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await service.findByExternalId('whatsapp', 'phone-123');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          type: 'whatsapp',
          externalId: 'phone-123',
          active: true,
        },
      });
    });
  });
});
