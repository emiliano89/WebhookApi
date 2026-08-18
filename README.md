# WebhookApi - Chatbot Integration Platform

<p align="center">
  <strong>API REST para integración de canales de comunicación con IA asistente automático</strong>
</p>

---

## 📋 Descripción General

**WebhookApi** es una aplicación backend construida con **NestJS** y **TypeScript** que proporciona una plataforma para:

- 🔗 Integración de múltiples canales de comunicación (WhatsApp, etc.)
- 🤖 Procesamiento automático de mensajes con IA
- 💬 Gestión de conversaciones por cliente
- 📊 Administración de servicios y negociOS
- 🔐 Autenticación y autorización de webhooks

## 📚 Documentación Rápida

| Documento | Descripción | Tiempo |
|-----------|-------------|--------|
| [📖 Índice de Docs](./docs/INDEX.md) | Guía completa de toda la documentación | 5 min |
| [⚡ Quick Start](./docs/QUICK_START.md) | Setup rápido local | 5 min |
| [🗄️ Database Setup](./docs/DATABASE_SETUP.md) | Configurar PostgreSQL | 15 min |
| [👨‍💻 Development](./docs/DEVELOPMENT.md) | Guía para desarrolladores | 20 min |
| [📊 Architecture](./docs/ARCHITECTURE.md) | Diagramas y flujos | 10 min |

**👉 [Ver documentación completa →](./docs/INDEX.md)**

## 🏗️ Arquitectura

### Estructura de Directorios

```
src/
├── ai/                          # Servicio de generación de respuestas con IA
│   ├── ai.module.ts
│   ├── ai.service.ts           # Integración con Ollama para LLM
│   └── ai.service.spec.ts
│
├── businesses/                  # Entidad de negocios
│   └── business.entity.ts
│
├── channel-contacts/           # Gestión de contactos por canal
│   ├── channel-contact.entity.ts
│   ├── channel-contacts.module.ts
│   └── channel-contacts.service.ts
│
├── channels/                   # Gestión de canales de comunicación
│   ├── channel.entity.ts
│   ├── channels.module.ts
│   └── channels.service.ts
│
├── conversations/             # Gestión de conversaciones
│   ├── conversation.entity.ts
│   ├── conversation.module.ts
│   └── conversations.service.ts
│
├── customers/                # Gestión de clientes
│   ├── customer.entity.ts
│   ├── customers.module.ts
│   └── customers.service.ts
│
├── messages/                 # Gestión de mensajes
│   ├── message.entity.ts
│   ├── messages.module.ts
│   └── messages.service.ts
│
├── services/                # Servicios/Productos ofrecidos
│   ├── services.entity.ts
│   ├── services.module.ts
│   └── services.service.ts
│
├── webhook/                # Procesamiento de webhooks - Escalable
│   ├── channels/                       # Canales específicos
│   │   └── whatsapp/
│   │       ├── whatsapp.adapter.ts     # Adaptador WhatsApp
│   │       └── dto/                    # DTOs de WhatsApp
│   │           ├── webhook.dto.ts
│   │           ├── entry.dto.ts
│   │           ├── change.dto.ts
│   │           ├── value.dto.ts
│   │           ├── message.dto.ts
│   │           ├── contact.dto.ts
│   │           ├── metadata.dto.ts
│   │           ├── status.dto.ts
│   │           └── index.ts
│   ├── shared/                         # Código compartido entre canales
│   │   ├── adapters/
│   │   │   └── channel.adapter.ts      # Interface genérica
│   │   └── models/
│   │       └── normalized-webhook-event.ts  # Evento normalizado
│   ├── registry/
│   │   └── channel-registry.service.ts # Registro y factory de adaptadores
│   ├── webhook.controller.ts
│   ├── webhook.module.ts
│   └── webhook.service.ts             # Orquestación de webhook
│
├── app.module.ts              # Módulo raíz
└── main.ts                    # Punto de entrada
```

### Base de Datos

**PostgreSQL** con esquema `chatbot`:

| Tabla | Descripción |
|-------|-------------|
| `businesses` | Información de negocios |
| `customers` | Clientes/contactos |
| `channels` | Canales de comunicación (WhatsApp, etc.) |
| `channel_contacts` | Mapeo entre contactos y canales |
| `conversations` | Conversaciones activas |
| `messages` | Historial de mensajes |
| `services` | Servicios ofrecidos por el negocio |

### Stack Tecnológico

- **Framework**: NestJS 11.0
- **Lenguaje**: TypeScript 5.7
- **Base de Datos**: PostgreSQL 
- **ORM**: TypeORM 0.3
- **IA**: Ollama (LLM local)
- **Testing**: Jest 30.0
- **Linting**: ESLint 9.18

## 🚀 Instalación y Configuración

### Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x o **yarn**
- **PostgreSQL** >= 12
- **Ollama** (para IA local)

### Pasos de Instalación

#### 1. Clonar el repositorio

```bash
git clone <repositorio-url>
cd WebhookApi
```

#### 2. Instalar dependencias

```bash
npm install
```

#### 3. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Base de Datos PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=chatbot_db

# Servidor
NODE_ENV=development
APP_PORT=3000

# Ollama (IA)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b

# Webhook
WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
```

#### 4. Crear Base de Datos

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE chatbot_db;

# Crear esquema
CREATE SCHEMA chatbot;
```

#### 5. Ejecutar Migraciones (si aplica)

```bash
npm run typeorm migration:run
```

## 📦 Scripts Disponibles

### Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo (con hot reload)
npm run start:dev

# Ejecutar en modo debug
npm run start:debug

# Ejecutar en modo producción compilado
npm run start:prod

# Compilar aplicación
npm run build
```

### Testing

```bash
# Ejecutar todos los tests unitarios
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ver cobertura de tests
npm run test:cov

# Ejecutar tests en modo debug
npm run test:debug

# Ejecutar tests E2E
npm run test:e2e
```

### Linting y Formato

```bash
# Ejecutar linter y auto-fix
npm run lint

# Formatear código
npm run format
```

## 🧪 Tests

### Estructura de Tests

Los tests están organizados en la carpeta `test/` con la siguiente estructura:

```
test/
├── ai/                              # Tests del servicio IA
├── channel-contacts/                # Tests de contactos por canal
├── channels/                        # Tests de canales
├── conversations/                   # Tests de conversaciones
├── customers/                       # Tests de clientes
├── messages/                        # Tests de mensajes
├── services/                        # Tests de servicios
└── webhook/                         # Tests de webhook
```

### Cobertura de Tests

- **Total**: 33 tests
- **Estado**: 9 suites pasadas ✅
- **Cobertura**: 67.93% statements, 65.92% branches, 52.38% functions

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests específicos
npm test -- conversations.service

# Con cobertura
npm run test:cov

# En modo watch
npm run test:watch
```

## 🔄 Flujo de Webhook

### 1. Recepción de Evento

```
WhatsApp → Webhook POST → /webhook/:channel
```

### 2. Normalización

El adaptador específico (ej: `WhatsAppAdapter`) normaliza el evento:

```typescript
{
  type: 'MESSAGE',
  channel: 'whatsapp',
  externalUserId: 'user-123',
  externalMessageId: 'msg-456',
  text: 'Hola',
  metadata: {
    phoneNumberId: 'phone-123',
    displayName: 'John Doe'
  }
}
```

### 3. Procesamiento

```
1. Buscar/crear canal
2. Buscar/crear cliente
3. Buscar/crear conversación
4. Guardar mensaje de usuario
5. Generar respuesta con IA
6. Guardar mensaje de asistente
7. Retornar respuesta
```

### 4. Respuesta

```json
{
  "received": true,
  "businessId": "123",
  "customerId": "456",
  "conversationId": "789",
  "messageId": "msg-1",
  "assistantMessageId": "msg-2",
  "response": "Respuesta generada por IA"
}
```

## 🔌 Integración de Nuevo Canal

La estructura de webhooks está diseñada para ser **escalable y modular**. Cada canal tiene su propia carpeta con sus DTOs y adaptador.

### 1. Crear Carpeta del Nuevo Canal

```bash
mkdir -p src/webhook/channels/facebook/dto
```

### 2. Crear DTOs Específicos del Canal

```typescript
// src/webhook/channels/facebook/dto/webhook.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class FacebookWebhookDto {
  @IsString()
  @IsNotEmpty()
  object!: string;
  
  // Definir estructura específica de Facebook
}
```

### 3. Crear Adaptador del Canal

```typescript
// src/webhook/channels/facebook/facebook.adapter.ts
import { Injectable } from '@nestjs/common';
import { ChannelAdapter } from '../../shared/adapters/channel.adapter';
import { FacebookWebhookDto } from './dto/webhook.dto';
import { NormalizedWebhookEvent } from '../../shared/models/normalized-webhook-event';

@Injectable()
export class FacebookAdapter implements ChannelAdapter {
  normalize(payload: unknown): NormalizedWebhookEvent {
    const webhook = payload as FacebookWebhookDto;
    // Lógica de normalización específica de Facebook
    return {
      channel: 'FACEBOOK',
      type: 'MESSAGE',
      externalUserId: '...',
      externalMessageId: '...',
      text: '...',
      timestamp: new Date(),
    };
  }
}
```

### 4. Registrar Adaptador en el Módulo

```typescript
// src/webhook/webhook.module.ts
import { FacebookAdapter } from './channels/facebook/facebook.adapter';

@Module({
  providers: [
    WebhookService,
    WhatsAppAdapter,
    FacebookAdapter, // ← Nuevo
    ChannelRegistryService,
  ],
})
export class WebhookModule {}
```

### 5. Registrar en ChannelRegistry

```typescript
// src/webhook/registry/channel-registry.service.ts
@Injectable()
export class ChannelRegistryService {
  constructor(
    private readonly whatsappAdapter: WhatsAppAdapter,
    private readonly facebookAdapter: FacebookAdapter, // ← Nuevo
  ) {
    this.adapters = new Map([
      ['whatsapp', this.whatsappAdapter],
      ['facebook', this.facebookAdapter], // ← Nuevo
    ]);
  }
}
```

### Estructura Resultante

```
src/webhook/channels/
├── whatsapp/
│   ├── whatsapp.adapter.ts
│   └── dto/
│       ├── webhook.dto.ts
│       └── ...
└── facebook/              ← Nuevo canal
    ├── facebook.adapter.ts
    └── dto/
        ├── webhook.dto.ts
        └── ...
```

## 📝 Endpoints Principales

### Webhook

```
POST /webhook/:channel
```

Procesa eventos de un canal específico (ej: `whatsapp`, `facebook`).

**Parámetros:**
- `channel` (string): Tipo de canal (whatsapp, facebook, etc.)

**Body:** Evento específico del canal

**Respuesta:**
```json
{
  "received": true,
  "businessId": "123",
  "customerId": "456",
  "conversationId": "789",
  "messageId": "msg-1",
  "assistantMessageId": "msg-2",
  "response": "Respuesta"
}
```

## 🚀 Despliegue

### Producción

```bash
# Compilar
npm run build

# Ejecutar
npm run start:prod
```

### Docker (opcional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
CMD ["node", "dist/main"]
```

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

Verificar:
- PostgreSQL está corriendo
- Variables de `.env` son correctas
- Base de datos y esquema existen

### Error: "Ollama connection failed"

Verificar:
- Ollama está ejecutándose (`ollama serve`)
- URL en `.env` es correcta
- Modelo está descargado (`ollama pull qwen2.5:7b`)

### Tests fallan

```bash
# Limpiar caché
npm run test -- --clearCache

# Ejecutar nuevamente
npm test
```

## 📚 Recursos Adicionales

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Ollama Documentation](https://ollama.ai)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

## 📄 Licencia

UNLICENSED

## 👥 Autor

Desarrollado con TypeScript y NestJS
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
