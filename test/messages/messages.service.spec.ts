import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MessagesService } from '../../src/messages/messages.service';
import { MessageEntity } from '../../src/messages/message.entity';

describe('MessagesService', () => {
  let service: MessagesService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getRepositoryToken(MessageEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findRecentByConversation', () => {
    it('should return recent messages ordered by creation date', async () => {
      const mockMessages = [
        { id: '1', conversationId: '100', content: 'msg1', role: 'USER', createdAt: new Date('2024-01-01') },
        { id: '2', conversationId: '100', content: 'msg2', role: 'ASSISTANT', createdAt: new Date('2024-01-02') },
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockMessages.reverse()),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findRecentByConversation('100', 20);

      expect(result).toEqual(mockMessages);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('message');
      expect(mockQueryBuilder.where).toHaveBeenCalled();
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
    });
  });

  describe('saveUserMessage', () => {
    it('should return existing message if already saved', async () => {
      const existingMessage = {
        id: '1',
        conversationId: '100',
        externalMessageId: 'ext-msg-1',
        role: 'USER',
        content: 'test',
      };

      mockRepository.findOne.mockResolvedValue(existingMessage);

      const result = await service.saveUserMessage('100', '200', 'ext-msg-1', 'test');

      expect(result).toEqual(existingMessage);
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should create and save new user message', async () => {
      const newMessage = {
        conversationId: '100',
        channelId: '200',
        externalMessageId: 'ext-msg-1',
        role: 'USER',
        content: 'test',
      };

      const savedMessage = { id: '1', ...newMessage };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(newMessage);
      mockRepository.save.mockResolvedValue(savedMessage);

      const result = await service.saveUserMessage('100', '200', 'ext-msg-1', 'test');

      expect(result).toEqual(savedMessage);
      expect(mockRepository.create).toHaveBeenCalledWith(newMessage);
      expect(mockRepository.save).toHaveBeenCalledWith(newMessage);
    });
  });

  describe('saveAssistantMessage', () => {
    it('should create and save new assistant message', async () => {
      const newMessage = {
        conversationId: '100',
        channelId: '200',
        externalMessageId: expect.stringMatching(/^internal-/),
        role: 'ASSISTANT',
        content: 'response',
      };

      const savedMessage = { id: '2', ...newMessage, externalMessageId: 'internal-123' };

      mockRepository.create.mockReturnValue(newMessage);
      mockRepository.save.mockResolvedValue(savedMessage);

      const result = await service.saveAssistantMessage('100', '200', 'response');

      expect(result.id).toEqual('2');
      expect(result.role).toEqual('ASSISTANT');
      expect(result.content).toEqual('response');
      expect(result.externalMessageId).toMatch(/^internal-/);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });
});
