# 🔌 Guía de Webhook - Nueva Estructura Escalable

Documentación de la arquitectura refactorizada del sistema de webhooks.

## 📋 Tabla de Contenidos

- [Estructura de Directorio](#estructura-de-directorio)
- [Componentes Principales](#componentes-principales)
- [Cómo Agregar un Canal](#cómo-agregar-un-canal)
- [Ejemplo: WhatsApp](#ejemplo-whatsapp)
- [Best Practices](#best-practices)

---

## 🗂️ Estructura de Directorio

```
src/webhook/
│
├── channels/                                  ← Canales específicos
│   └── whatsapp/                             ← Cada canal en su carpeta
│       ├── whatsapp.adapter.ts               ← Implementación del adaptador
│       └── dto/                              ← DTOs específicos del canal
│           ├── webhook.dto.ts
│           ├── entry.dto.ts
│           ├── change.dto.ts
│           ├── value.dto.ts
│           ├── message.dto.ts
│           ├── contact.dto.ts
│           ├── metadata.dto.ts
│           ├── status.dto.ts
│           └── index.ts                      ← Barrel export
│
├── shared/                                    ← Código compartido
│   ├── adapters/
│   │   └── channel.adapter.ts                ← Interface genérica
│   └── models/
│       └── normalized-webhook-event.ts       ← Evento compartido
│
├── registry/
│   └── channel-registry.service.ts           ← Factory de adaptadores
│
├── webhook.controller.ts                     ← Endpoint HTTP
├── webhook.module.ts                         ← Módulo NestJS
└── webhook.service.ts                        ← Orquestación
```

---

## 🧩 Componentes Principales

### 1. ChannelAdapter (Interface)

Define el contrato que todos los adaptadores deben cumplir:

```typescript
// src/webhook/shared/adapters/channel.adapter.ts
export interface ChannelAdapter {
  normalize(payload: unknown): NormalizedWebhookEvent;
}
```

**Responsabilidades:**
- ✅ Validar estructura del webhook específico del canal
- ✅ Normalizar a formato interno `NormalizedWebhookEvent`
- ✅ Lanzar excepciones para payloads inválidos

---

### 2. NormalizedWebhookEvent (Modelo Compartido)

Estructura común que todos los canales usan internamente:

```typescript
// src/webhook/shared/models/normalized-webhook-event.ts
export interface NormalizedWebhookEvent {
  channel: string;                    // 'WHATSAPP', 'FACEBOOK', etc.
  type: 'MESSAGE' | 'STATUS';        // Tipo de evento
  externalUserId?: string;            // ID del usuario en el canal
  externalMessageId: string;          // ID único del mensaje
  text?: string;                      // Contenido del mensaje
  timestamp: Date;                    // Cuándo ocurrió
  status?: string;                    // Estado del mensaje
  metadata?: {
    phoneNumberId?: string;
    displayPhoneNumber?: string;
    displayName?: string;
  };
}
```

---

### 3. ChannelRegistryService (Factory)

Registra y proporciona adaptadores según el canal:

```typescript
// src/webhook/registry/channel-registry.service.ts
@Injectable()
export class ChannelRegistryService {
  private readonly adapters: Map<string, ChannelAdapter>;

  constructor(
    private readonly whatsappAdapter: WhatsAppAdapter,
    private readonly facebookAdapter: FacebookAdapter, // Futuro
  ) {
    this.adapters = new Map([
      ['whatsapp', this.whatsappAdapter],
      ['facebook', this.facebookAdapter],
    ]);
  }

  getAdapter(channel: string): ChannelAdapter {
    const adapter = this.adapters.get(channel.toLowerCase());
    if (!adapter) {
      throw new NotFoundException(`Canal no soportado: ${channel}`);
    }
    return adapter;
  }
}
```

---

### 4. WebhookService (Orquestación)

Coordina el flujo completo del webhook:

```typescript
// src/webhook/webhook.service.ts
@Injectable()
export class WebhookService {
  async process(channel: string, body: unknown) {
    // 1. Obtener adaptador del registro
    const adapter = this.channelRegistry.getAdapter(channel);
    
    // 2. Normalizar webhook
    const event = adapter.normalize(body);
    
    // 3. Procesar evento (crear conversación, guardar mensaje, etc.)
    // 4. Generar respuesta con IA
    // 5. Devolver respuesta
  }
}
```

---

## 🚀 Cómo Agregar un Canal

### Paso 1: Crear Estructura de Carpetas

```bash
mkdir -p src/webhook/channels/facebook/dto
```

### Paso 2: Crear DTOs del Canal

Crear archivos para cada nivel de la estructura JSON:

```typescript
// src/webhook/channels/facebook/dto/webhook.dto.ts
export class WebhookDto {
  @IsString()
  @IsNotEmpty()
  object!: string;
  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntryDto)
  entry!: EntryDto[];
}

// src/webhook/channels/facebook/dto/entry.dto.ts
export class EntryDto {
  @IsString()
  @IsNotEmpty()
  id!: string;
  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messaging!: MessageDto[];
}

// src/webhook/channels/facebook/dto/message.dto.ts
export class MessageDto {
  @IsString()
  @IsNotEmpty()
  sender!: string;
  
  @IsString()
  @IsNotEmpty()
  recipient!: string;
  
  @ValidateNested()
  @Type(() => TextDto)
  message!: TextDto;
}

// src/webhook/channels/facebook/dto/text.dto.ts
export class TextDto {
  @IsString()
  text!: string;
}

// src/webhook/channels/facebook/dto/index.ts
export { WebhookDto } from './webhook.dto';
export { EntryDto } from './entry.dto';
export { MessageDto } from './message.dto';
export { TextDto } from './text.dto';
```

### Paso 3: Crear Adaptador

```typescript
// src/webhook/channels/facebook/facebook.adapter.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { ChannelAdapter } from '../../shared/adapters/channel.adapter';
import { WebhookDto } from './dto/webhook.dto';
import { NormalizedWebhookEvent } from '../../shared/models/normalized-webhook-event';

@Injectable()
export class FacebookAdapter implements ChannelAdapter {
  
  normalize(payload: unknown): NormalizedWebhookEvent {
    const webhook = payload as WebhookDto;
    
    // Validar estructura
    if (!webhook.entry?.[0]?.messaging?.[0]) {
      throw new BadRequestException('Invalid Facebook webhook payload');
    }
    
    const message = webhook.entry[0].messaging[0];
    
    return {
      channel: 'FACEBOOK',
      type: 'MESSAGE',
      externalUserId: message.sender,
      externalMessageId: `${message.sender}-${Date.now()}`,
      text: message.message?.text,
      timestamp: new Date(),
      metadata: {
        displayName: 'Facebook User',
      },
    };
  }
}
```

### Paso 4: Registrar en Módulo

```typescript
// src/webhook/webhook.module.ts
import { FacebookAdapter } from './channels/facebook/facebook.adapter';

@Module({
  providers: [
    WebhookService,
    WhatsAppAdapter,
    FacebookAdapter,    // ← Nuevo
    ChannelRegistryService,
  ],
})
export class WebhookModule {}
```

### Paso 5: Registrar en Registry

```typescript
// src/webhook/registry/channel-registry.service.ts
@Injectable()
export class ChannelRegistryService {
  constructor(
    private readonly whatsappAdapter: WhatsAppAdapter,
    private readonly facebookAdapter: FacebookAdapter,  // ← Nuevo
  ) {
    this.adapters = new Map([
      ['whatsapp', this.whatsappAdapter],
      ['facebook', this.facebookAdapter],  // ← Nuevo
    ]);
  }
}
```

---

## 📱 Ejemplo: WhatsApp

### Estructura Actual

```
src/webhook/channels/whatsapp/
├── whatsapp.adapter.ts
└── dto/
    ├── webhook.dto.ts      (WhatsAppWebhookDto → WebhookDto)
    ├── entry.dto.ts        (WhatsAppEntryDto → EntryDto)
    ├── change.dto.ts       (WhatsAppChangeDto → ChangeDto)
    ├── value.dto.ts        (WhatsAppValueDto → ValueDto)
    ├── message.dto.ts      (WhatsAppMessageDto → MessageDto)
    ├── contact.dto.ts      (WhatsAppContactDto → ContactDto)
    ├── metadata.dto.ts     (WhatsAppMetadataDto → MetadataDto)
    ├── status.dto.ts       (WhatsAppStatusDto → StatusDto)
    └── index.ts
```

### Flujo de WhatsApp

```
1. Webhook llega a POST /webhooks/whatsapp
   ↓
2. Controller pasa body a WebhookService.process('whatsapp', body)
   ↓
3. Registry obtiene WhatsAppAdapter
   ↓
4. Adapter.normalize(body) convierte a NormalizedWebhookEvent
   ↓
5. WebhookService procesa: busca cliente, crea conversación, etc.
   ↓
6. AiService genera respuesta
   ↓
7. Devuelve respuesta al cliente
```

---

## 📌 Best Practices

### 1. Nombrado Consistente

```typescript
// ✅ Dentro de channels/whatsapp/
WebhookDto → Genérico al canal
EntryDto
ChangeDto
MessageDto

// ❌ Evitar
WhatsAppWebhookDto → Redundante
WhatsAppEntryDto
WhatsAppChangeDto
```

### 2. Mantener Shared Limpio

```typescript
// ✅ En shared/
- ChannelAdapter (interface)
- NormalizedWebhookEvent (modelo)

// ❌ Evitar poner en shared
- DTOs específicos de un canal
- Lógica de normalización
```

### 3. Organizar por Canal

```typescript
// ✅ Estructura
channels/
├── whatsapp/  → Autónomo
├── facebook/  → Autónomo
├── instagram/ → Autónomo

// ❌ Evitar
dto/
├── whatsapp/
├── facebook/
├── instagram/
adapters/
├── whatsapp.adapter.ts
├── facebook.adapter.ts
```

### 4. Exportaciones Barrel

```typescript
// src/webhook/channels/whatsapp/dto/index.ts
export { WebhookDto } from './webhook.dto';
export { EntryDto } from './entry.dto';
// ... etc

// En adapter
import { WebhookDto, EntryDto } from './dto'; // Limpio
```

---

## 🧪 Testing Canales

### Estructura de Tests

```
test/webhook/channels/
├── whatsapp/
│   ├── whatsapp.adapter.spec.ts
│   └── dto/
└── (facebook/   → Futuro)
```

### Ejemplo de Test

```typescript
describe('WhatsAppAdapter', () => {
  let adapter: WhatsAppAdapter;

  beforeEach(() => {
    adapter = new WhatsAppAdapter();
  });

  it('should normalize WhatsApp message', () => {
    const payload = { /* webhook data */ };
    const event = adapter.normalize(payload);
    
    expect(event.channel).toBe('WHATSAPP');
    expect(event.type).toBe('MESSAGE');
    expect(event.text).toBeDefined();
  });
});
```

---

## 🔄 Migración de Cambios

Si necesitas cambiar la lógica de normalización:

```typescript
// Antes: Afectaba a todo el sistema
src/webhook/adapters/whatsapp.adapter.ts ← Cambio riesgoso

// Después: Aislado al canal
src/webhook/channels/whatsapp/whatsapp.adapter.ts ← Seguro
```

---

## 📚 Recursos Relacionados

- [README.md](../README.md) - Documentación general
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Guía de desarrollo
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Diagramas de arquitectura

---

**Versión:** 1.0  
**Última actualización:** 2026-08-17
