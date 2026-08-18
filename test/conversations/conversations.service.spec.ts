import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConversationsService } from '../../src/conversations/conversations.service';
import { ConversationEntity } from '../../src/conversations/conversation.entity';

describe('ConversationsService', () => {
  let service: ConversationsService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsService,
        {
          provide: getRepositoryToken(ConversationEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOrCreate', () => {
    it('should return existing conversation if found', async () => {
      const mockConversation = {
        id: '1',
        businessId: '100',
        customerId: '200',
        channelId: '300',
        status: 'OPEN',
      };

      mockRepository.findOne.mockResolvedValue(mockConversation);

      const result = await service.findOrCreate('100', '200', '300');

      expect(result).toEqual(mockConversation);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          businessId: '100',
          customerId: '200',
          channelId: '300',
          status: 'OPEN',
        },
      });
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should create new conversation if not found', async () => {
      const newConversation = {
        businessId: '100',
        customerId: '200',
        channelId: '300',
        status: 'OPEN',
      };

      const savedConversation = {
        id: '1',
        ...newConversation,
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(newConversation);
      mockRepository.save.mockResolvedValue(savedConversation);

      const result = await service.findOrCreate('100', '200', '300');

      expect(result).toEqual(savedConversation);
      expect(mockRepository.create).toHaveBeenCalledWith(newConversation);
      expect(mockRepository.save).toHaveBeenCalledWith(newConversation);
    });
  });
});
