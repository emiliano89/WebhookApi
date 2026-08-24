import { Injectable } from '@nestjs/common';
import ollama from 'ollama';

import { MessagesService } from '../messages/messages.service';
import { ServicesService } from '../services/services.service';
import { ProductsService } from '../products/products.service';
import { AiToolsService } from './tools/ai-tools.service';

@Injectable()
export class AiService {

  constructor(
    private readonly messagesService: MessagesService,
    private readonly servicesService: ServicesService,
    private readonly productsService: ProductsService,
    private readonly aiToolsService: AiToolsService,
  ) {}

  async generateResponse(
    conversationId: string,
    businessId: string,
  ): Promise<string> {

    const messages =
      await this.messagesService.findRecentByConversation(
        conversationId,
        20,
      );

    const services =
      await this.servicesService.findActiveByBusiness(
        businessId,
      );

    const products =
      await this.productsService.findActiveByBusiness(
        businessId,
      );

    const servicesContext = services
      .map((service) =>
        `${service.name} - $${service.price ?? 'Consultar'}`,
      )
      .join('\n');

    const productsContext = products
      .map((product) =>
        `${product.name} - $${product.price ?? 'Consultar'}`,
      )
      .join('\n');

    // 1. Tipamos explícitamente el array con el tipo nativo de Ollama
    const ollamaMessages: Array<{ role: 'user' | 'assistant' | 'system' | 'tool'; content: string; tool_calls?: any }> = [
      {
        role: 'system',
        content: `
Sos un asistente virtual de atención al cliente.

Respondé directamente al cliente.
No inventes información.
Utilizá las herramientas disponibles cuando necesites información específica.

Servicios:
${servicesContext}

Productos:
${productsContext}
        `.trim(),
      },

      ...messages.map((message) => {
        // Aseguramos que el rol coincida exactamente con lo esperado
        let role: 'user' | 'assistant' | 'system' = 'user';
        const lowerRole = message.role.toLowerCase();
        if (lowerRole === 'assistant') role = 'assistant';
        if (lowerRole === 'system') role = 'system';

        return {
          role,
          content: message.content,
        };
      }),
    ];

    const tools = [
      {
        type: 'function' as const,
        function: {
          name: 'get_service',
          description:
            'Obtiene información detallada sobre un servicio del negocio.',
          parameters: {
            type: 'object',
            required: ['serviceName'],
            properties: {
              serviceName: {
                type: 'string',
                description:
                  'Nombre del servicio que se quiere consultar',
              },
            },
          },
        },
      },
    ];

    const response = await ollama.chat({
      model: 'qwen2.5:7b',
      messages: ollamaMessages,
      tools,
    });

    if (!response.message.tool_calls?.length) {
      return response.message.content;
    }

    // 2. Agregamos la respuesta del asistente (que pide ejecutar la herramienta) al historial
    ollamaMessages.push({
      role: 'assistant',
      content: response.message.content || '',
      tool_calls: response.message.tool_calls,
    });

    for (const toolCall of response.message.tool_calls) {

      if (toolCall.function.name === 'get_service') {

        const args =
          toolCall.function.arguments as {
            serviceName: string;
          };

        const result =
          await this.aiToolsService.getService(
            businessId,
            args.serviceName,
          );

        // 3. Agregamos el resultado de la ejecución con el rol 'tool'
        ollamaMessages.push({
          role: 'tool',
          content: JSON.stringify(result),
        });
      }
    }

    const finalResponse = await ollama.chat({
      model: 'qwen2.5:7b',
      messages: ollamaMessages,
      tools,
    });

    return finalResponse.message.content;
  }
}
