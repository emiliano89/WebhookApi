import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { WebhookService } from '../../src/webhook/webhook.service';
import { ChannelRegistryService } from '../../src/webhook/registry/channel-registry.service';
import { ChannelsService } from '../../src/channels/channels.service';
import { CustomersService } from '../../src/customers/customers.service';
import { ConversationsService } from '../../src/conversations/conversations.service';
import { MessagesService } from '../../src/messages/messages.service';
import { AiService } from '../../src/ai/ai.service';

describe('WebhookService', () => {
  let service: WebhookService;
  let mockChannelRegistry: any;
  let mockChannelsService: any;
  let mockCustomersService: any;
  let mockConversationsService: any;
  let mockMessagesService: any;
  let mockAiService: any;

  beforeEach(async () => {
    mockChannelRegistry = {
      getAdapter: jest.fn(),
    };

    mockChannelsService = {
      findByExternalId: jest.fn(),
    };

    mockCustomersService = {
      findOrCreate: jest.fn(),
    };

    mockConversationsService = {
      findOrCreate: jest.fn(),
    };

    mockMessagesService = {
      saveUserMessage: jest.fn(),
      saveAssistantMessage: jest.fn(),
    };

    mockAiService = {
      generateResponse: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookService,
        {
          provide: ChannelRegistryService,
          useValue: mockChannelRegistry,
        },
        {
          provide: ChannelsService,
          useValue: mockChannelsService,
        },
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
        {
          provide: ConversationsService,
          useValue: mockConversationsService,
        },
        {
          provide: MessagesService,
          useValue: mockMessagesService,
        },
        {
          provide: AiService,
          useValue: mockAiService,
        },
      ],
    }).compile();

    service = module.get<WebhookService>(WebhookService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('process', () => {
    const mockAdapter = {
      normalize: jest.fn(),
    };

    const mockEvent = {
      type: 'MESSAGE',
      channel: 'whatsapp',
      externalUserId: 'user-123',
      externalMessageId: 'msg-123',
      text: 'Hello',
      metadata: {
        phoneNumberId: 'phone-123',
        displayName: 'John Doe',
      },
    };

    beforeEach(() => {
      mockChannelRegistry.getAdapter.mockReturnValue(mockAdapter);
    });

    it('should throw BadRequestException if external user ID not found', async () => {
      const eventWithoutUserId = { ...mockEvent, externalUserId: null };
      mockAdapter.normalize.mockReturnValue(eventWithoutUserId);

      await expect(
        service.process('whatsapp', {}),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if channel external ID not found', async () => {
      const eventWithoutChannelId = {
        ...mockEvent,
        metadata: { ...mockEvent.metadata, phoneNumberId: null },
      };
      mockAdapter.normalize.mockReturnValue(eventWithoutChannelId);

      await expect(
        service.process('whatsapp', {}),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if message text not found', async () => {
      const eventWithoutText = { ...mockEvent, text: null };
      mockAdapter.normalize.mockReturnValue(eventWithoutText);

      await expect(
        service.process('whatsapp', {}),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if channel not found', async () => {
      mockAdapter.normalize.mockReturnValue(mockEvent);
      mockChannelsService.findByExternalId.mockResolvedValue(null);

      await expect(
        service.process('whatsapp', {}),
      ).rejects.toThrow(NotFoundException);
    });

    it('should successfully process a valid message event', async () => {
      const mockChannel = {
        id: 'channel-1',
        businessId: 'business-1',
        type: 'whatsapp',
        externalId: 'phone-123',
        active: true,
      };

      const mockCustomer = {
        id: 'customer-1',
        businessId: 'business-1',
        name: 'John Doe',
      };

      const mockConversation = {
        id: 'conversation-1',
        businessId: 'business-1',
        customerId: 'customer-1',
        channelId: 'channel-1',
        status: 'OPEN',
      };

      const mockUserMessage = {
        id: 'message-1',
        conversationId: 'conversation-1',
        content: 'Hello',
      };

      const mockAssistantMessage = {
        id: 'message-2',
        conversationId: 'conversation-1',
        content: 'Hi there',
      };

      mockAdapter.normalize.mockReturnValue(mockEvent);
      mockChannelsService.findByExternalId.mockResolvedValue(mockChannel);
      mockCustomersService.findOrCreate.mockResolvedValue(mockCustomer);
      mockConversationsService.findOrCreate.mockResolvedValue(mockConversation);
      mockMessagesService.saveUserMessage.mockResolvedValue(mockUserMessage);
      mockAiService.generateResponse.mockResolvedValue('Hi there');
      mockMessagesService.saveAssistantMessage.mockResolvedValue(mockAssistantMessage);

      const result = await service.process('whatsapp', {});

      expect(result).toEqual({
        received: true,
        businessId: 'business-1',
        customerId: 'customer-1',
        conversationId: 'conversation-1',
        messageId: 'message-1',
        assistantMessageId: 'message-2',
        response: 'Hi there',
      });

      expect(mockChannelRegistry.getAdapter).toHaveBeenCalledWith('whatsapp');
      expect(mockChannelsService.findByExternalId).toHaveBeenCalled();
      expect(mockCustomersService.findOrCreate).toHaveBeenCalled();
      expect(mockConversationsService.findOrCreate).toHaveBeenCalled();
      expect(mockMessagesService.saveUserMessage).toHaveBeenCalled();
      expect(mockAiService.generateResponse).toHaveBeenCalled();
      expect(mockMessagesService.saveAssistantMessage).toHaveBeenCalled();
    });
  });
});
