jest.mock('ollama');

import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from '../../src/ai/ai.service';
import { MessagesService } from '../../src/messages/messages.service';
import { ServicesService } from '../../src/services/services.service';
import ollama from 'ollama';

const mockOllama = ollama as jest.Mocked<typeof ollama>;

describe('AiService', () => {
  let service: AiService;
  let mockMessagesService: any;
  let mockServicesService: any;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockMessagesService = {
      findRecentByConversation: jest.fn(),
    };

    mockServicesService = {
      findActiveByBusiness: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: MessagesService,
          useValue: mockMessagesService,
        },
        {
          provide: ServicesService,
          useValue: mockServicesService,
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateResponse', () => {
    it('should call messagesService and servicesService', async () => {
      const mockMessages = [
        { id: '1', role: 'USER', content: 'Hello', conversationId: 'conv-1' },
        { id: '2', role: 'ASSISTANT', content: 'Hi there', conversationId: 'conv-1' },
      ];

      const mockServices = [
        { id: '1', name: 'Service A', description: 'Desc A', price: '100', durationMinutes: 30 },
      ];

      mockMessagesService.findRecentByConversation.mockResolvedValue(mockMessages);
      mockServicesService.findActiveByBusiness.mockResolvedValue(mockServices);

      (mockOllama.chat as jest.Mock).mockResolvedValue({
        message: {
          content: 'This is a response from the AI',
        },
      });

      const result = await service.generateResponse('conv-1', 'bus-1');

      expect(result).toBe('This is a response from the AI');
      expect(mockMessagesService.findRecentByConversation).toHaveBeenCalledWith('conv-1', 20);
      expect(mockServicesService.findActiveByBusiness).toHaveBeenCalledWith('bus-1');
      expect(mockOllama.chat).toHaveBeenCalled();
    });
  });
});
