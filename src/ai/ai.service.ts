import { Injectable } from '@nestjs/common';
import ollama from 'ollama';

import { MessagesService } from '../messages/messages.service';
import { ServicesService } from '../services/services.service';

@Injectable()
export class AiService {

  constructor(
    private readonly messagesService: MessagesService,
    private readonly servicesService: ServicesService,
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

    const servicesContext = services
      .map((service) => {
        return [
          `Nombre: ${service.name}`,
          `Descripción: ${service.description ?? 'Sin descripción'}`,
          `Precio: ${service.price ?? 'Consultar'}`,
          `Duración: ${service.durationMinutes ?? 'No especificada'} minutos`,
        ].join('\n');
      })
      .join('\n\n');

    const ollamaMessages = messages.map((message) => ({
      role: message.role.toLowerCase() as 'user' | 'assistant',
      content: message.content,
    }));

    const response = await ollama.chat({
      model: 'qwen2.5:7b',
      messages: [
        {
  role: 'system',
  content: `
Sos el asistente virtual de atención al cliente de un negocio.

Tu única tarea es responder directamente al último mensaje del cliente.

REGLAS:
- Respondé directamente al cliente.
- No escribas ejemplos.
- No escribas instrucciones.
- No escribas "Si dice...", "Puedes responder..." ni frases similares.
- No expliques cómo debería responder el asistente.
- No inventes información.
- Utilizá solamente la información disponible en el contexto del negocio y en la conversación.
- Si no tenés información suficiente, decí que no disponés de ese dato.
- Sé breve, natural y amable.
- No menciones PostgreSQL, base de datos, contexto, prompts ni modelos de IA.

INFORMACIÓN DEL NEGOCIO:

${servicesContext}
  `.trim(),
},
        ...ollamaMessages,
      ],
    });

    return response.message.content;
  }
}