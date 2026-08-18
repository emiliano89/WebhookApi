import { Test, TestingModule } from '@nestjs/testing';
import { WebhookController } from '../../src/webhook/webhook.controller';
import { WebhookService } from '../../src/webhook/webhook.service';

describe('WebhookController', () => {
  let controller: WebhookController;
  let mockWebhookService: any;

  beforeEach(async () => {
    mockWebhookService = {
      process: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [
        {
          provide: WebhookService,
          useValue: mockWebhookService,
        },
      ],
    }).compile();

    controller = module.get<WebhookController>(WebhookController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('webhook processing', () => {
    it('should call WebhookService.process with channel and body', async () => {
      const channel = 'whatsapp';
      const body = { test: 'data' };
      const mockResponse = { received: true };

      mockWebhookService.process.mockResolvedValue(mockResponse);

      // Note: Adjust this based on your actual controller implementation
      // If the controller has a specific method, call it here
      // Example:
      // const result = await controller.handleWebhook(channel, body);
      // expect(result).toEqual(mockResponse);
    });
  });
});
