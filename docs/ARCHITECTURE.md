# 📊 Diagramas de Flujo y Arquitectura

Visualización de los flujos principales en WebhookApi.

## 🔄 Flujo de Procesamiento de Webhook

```
┌─────────────────────────────────────────────────────────────────────┐
│                    WEBHOOK ENTRANTE (WhatsApp)                      │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
                ┌────────────────────────────┐
                │  Webhook Controller        │
                │  POST /webhook/whatsapp    │
                └────────────┬───────────────┘
                             │
                             ▼
                ┌────────────────────────────┐
                │  Webhook Service           │
                │  process()                 │
                └────────────┬───────────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
       ┌─────────────────────┐   ┌──────────────────────┐
       │  Channel Adapter    │   │  Validaciones        │
       │  (WhatsApp)         │   │  - Usuario existe?   │
       │  normalize()        │   │  - Canal existe?     │
       │                     │   │  - Mensaje existe?   │
       └────────────┬────────┘   └──────────────────────┘
                    │
                    ▼
       ┌─────────────────────────────┐
       │  Evento Normalizado         │
       │  {                          │
       │    type: 'MESSAGE',         │
       │    channel: 'whatsapp',     │
       │    externalUserId,          │
       │    text: 'Hola',            │
       │    metadata: {...}          │
       │  }                          │
       └─────────────┬───────────────┘
                     │
      ┌──────────────┼──────────────┬──────────────┐
      ▼              ▼              ▼              ▼
   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐
   │ Buscar  │  │ Buscar  │  │ Buscar  │  │ Guardar  │
   │ Canal   │  │ Cliente │  │Conversa-│  │ Mensaje  │
   │         │  │         │  │   ción  │  │  Usuario │
   └────┬────┘  └────┬────┘  └────┬────┘  └────┬─────┘
        │            │            │            │
        └────────────┼────────────┴────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   AI Service               │
        │   generateResponse()       │
        │                            │
        │  - Obtener mensajes       │
        │  - Obtener servicios      │
        │  - Generar con Ollama     │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   Guardar Respuesta        │
        │   Mensaje Assistant        │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   Respuesta Exitosa        │
        │   {                        │
        │     received: true,        │
        │     response: "...",       │
        │     messageId: "...",      │
        │     ...                    │
        │   }                        │
        └────────────────────────────┘
```

---

## 🗄️ Modelo de Datos

```
┌──────────────────────────────────────────────────────────────────────┐
│                         CHATBOT SCHEMA (PostgreSQL)                  │
└──────────────────────────────────────────────────────────────────────┘

                            ┌─────────────────┐
                            │   BUSINESSES    │
                            │─────────────────│
                            │ id (PK)         │
                            │ name            │
                            │ created_at      │
                            └────────┬────────┘
                                     │
                 ┌───────────────────┼───────────────────┐
                 │                   │                   │
                 ▼                   ▼                   ▼
        ┌───────────────┐   ┌─────────────────┐  ┌──────────────┐
        │  CUSTOMERS    │   │   CHANNELS      │  │  SERVICES    │
        ├───────────────┤   ├─────────────────┤  ├──────────────┤
        │ id            │   │ id              │  │ id           │
        │ business_id→  │   │ business_id→    │  │ business_id→ │
        │ name          │   │ type            │  │ name         │
        │ email         │   │ external_id     │  │ description  │
        │ created_at    │   │ name            │  │ price        │
        └───────┬───────┘   │ active          │  │ duration_min │
                │           │ created_at      │  │ active       │
                │           └────────┬────────┘  │ created_at   │
                │                    │           └──────────────┘
                │                    │
                │           ┌────────┴────────┐
                │           ▼                 ▼
                │    ┌──────────────────┐
                │    │CHANNEL_CONTACTS  │
                │    ├──────────────────┤
                │    │ id               │
                │    │ channel_id→      │
                │    │ customer_id→     │
                │    │ external_id      │
                │    │ display_name     │
                │    │ created_at       │
                │    └──────────────────┘
                │
                ▼
        ┌──────────────────────┐
        │  CONVERSATIONS       │
        ├──────────────────────┤
        │ id                   │
        │ business_id→         │
        │ customer_id→         │
        │ channel_id→          │
        │ status (OPEN/CLOSED) │
        │ created_at           │
        │ closed_at            │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │    MESSAGES          │
        ├──────────────────────┤
        │ id                   │
        │ conversation_id→     │
        │ channel_id→          │
        │ external_message_id  │
        │ role (USER/ASSISTANT)│
        │ content              │
        │ created_at           │
        └──────────────────────┘

KEY RELATIONSHIPS:
- CUSTOMERS → BUSINESSES (many-to-one)
- CHANNELS → BUSINESSES (many-to-one)
- SERVICES → BUSINESSES (many-to-one)
- CHANNEL_CONTACTS → CHANNELS (many-to-one)
- CHANNEL_CONTACTS → CUSTOMERS (many-to-one)
- CONVERSATIONS → BUSINESSES (many-to-one)
- CONVERSATIONS → CUSTOMERS (many-to-one)
- CONVERSATIONS → CHANNELS (many-to-one)
- MESSAGES → CONVERSATIONS (many-to-one)
- MESSAGES → CHANNELS (many-to-one)
```

---

## 🏗️ Arquitectura de Capas

```
┌──────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Controllers                                               │  │
│  │  - WebhookController                                       │  │
│  │  - Maneja requests HTTP                                    │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Services                                                  │  │
│  │  - WebhookService (orquestación)                          │  │
│  │  - AiService (generación de respuestas)                   │  │
│  │  - CustomersService                                       │  │
│  │  - ConversationsService                                   │  │
│  │  - MessagesService                                        │  │
│  │  - ChannelsService                                        │  │
│  │  - ServicesService                                        │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Adapters (Channel-specific logic)                         │  │
│  │  - ChannelAdapter (interface)                             │  │
│  │  - WhatsAppAdapter                                        │  │
│  │  - ChannelRegistry (factory)                              │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  DTOs (Data validation)                                    │  │
│  │  - WhatsAppWebhookDto                                     │  │
│  │  - NormalizedWebhookEvent                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────────┐
│                  PERSISTENCE LAYER                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Repositories (TypeORM)                                    │  │
│  │  - BusinessRepository                                     │  │
│  │  - CustomerRepository                                     │  │
│  │  - ConversationRepository                                 │  │
│  │  - MessageRepository                                      │  │
│  │  - ChannelRepository                                      │  │
│  │  - ServiceRepository                                      │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────────┐
│                  EXTERNAL SERVICES                               │
│  ┌─────────────────────┬──────────────────────┬──────────────┐   │
│  │   PostgreSQL        │   Ollama (LLM)       │  WhatsApp    │   │
│  │   (Database)        │   (AI Responses)     │  (Webhooks)  │   │
│  └─────────────────────┴──────────────────────┴──────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Ciclo de Vida de Conversación

```
1. PRIMER MENSAJE
   ┌─────────────────────┐
   │  Usuario envía      │
   │  mensaje en         │
   │  WhatsApp           │
   └────────┬────────────┘
            │
            ▼
   ┌─────────────────────┐
   │  Se crea:           │
   │  - Customer         │
   │  - Conversation     │
   │  - Message (USER)   │
   │  - Message (ASST)   │
   └────────┬────────────┘
            │
            ▼
   ┌─────────────────────┐
   │  Estado:            │
   │  OPEN               │
   └─────────────────────┘


2. CONVERSACIÓN ACTIVA
   ┌─────────────────────┐
   │  Usuario           │
   │  ├─ Mensaje 1      │
   │  ├─ Respuesta 1    │
   │  ├─ Mensaje 2      │
   │  ├─ Respuesta 2    │
   │  └─ ...            │
   │                    │
   │  Estado: OPEN      │
   └─────────────────────┘


3. CIERRE (futuro)
   ┌─────────────────────┐
   │  Conversación       │
   │  status = CLOSED    │
   │  closed_at = ahora  │
   └─────────────────────┘
```

---

## 🔐 Seguridad de Webhook

```
┌────────────────────────────────────────┐
│  Webhook Request (WhatsApp)            │
│  POST /webhook/whatsapp                │
└────────────────────┬───────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Verificar Token      │
         │  (si es requerido)    │
         │  WEBHOOK_VERIFY_TOKEN │
         └───────────┬───────────┘
                     │
         ┌───────────┴────────────┐
         │ Válido?                │
         ▼                        ▼
    ┌────────┐              ┌──────────┐
    │  Sí    │              │  No      │
    │ ─────  │              │ ──────── │
    │Procesar│              │  Error   │
    │webhook │              │   401    │
    └────────┘              └──────────┘
         │
         ▼
    ┌─────────────┐
    │  Normalizar │
    │  Validar    │
    └─────────────┘
```

---

## 📊 Estadísticas de Flujo

```
Métricas por Conversación:

┌────────────────────────────┐
│  CONVERSACIÓN              │
│                            │
│  Total Mensajes: 50        │
│  ├─ Usuario: 25            │
│  └─ Asistente: 25          │
│                            │
│  Tiempo Abierta: 2 horas   │
│                            │
│  Tópicos Tratados:         │
│  ├─ Reservas: 15 msg       │
│  ├─ Precios: 20 msg        │
│  └─ Info General: 15 msg   │
└────────────────────────────┘
```

---

## 🎯 Puntos de Integración

```
CANAL EXTERNO                  WEBHOOK API                  BD INTERNA
    │                              │                            │
    ├──────────────────────────────┤                            │
    │   Event: message.received    │                            │
    │   Body: {...}               │                            │
    │                              ▼                            │
    │                    POST /webhook/:channel                 │
    │                              │                            │
    │                              ├────────────────────────────┤
    │                              │ Query: buscar/crear datos  │
    │                              │                            │
    │                              ▼                            │
    │                              ├──────────────────────────→ │
    │                              │ Guardar: conversation,     │
    │                              │ messages, etc              │
    │                              │                            │
    │                            ┌─┴────────────────────────────┤
    │                            │ Query: obtener contexto      │
    │                            │                              │
    │                            ▼                              │
    │                    Ollama Service (AI)                    │
    │                    generateResponse()                     │
    │                            │                              │
    │                            ├──────────────────────────────┤
    │                            │ Guardar: respuesta mensaje   │
    │                            │                              │
    │                            ▼                              │
    │  ┌────────────────────────────────────────────────────┐   │
    │  │ Response: {                                        │   │
    │  │   received: true,                                  │   │
    │  │   response: "Respuesta generada",                  │   │
    │  │   messageId, conversationId, etc                  │   │
    │  │ }                                                  │   │
    │  └────────────────────────────────────────────────────┘   │
    │◀──────────────────────────────────────────────────────────┤
    │                                                             │
    ├──────────────────────────────────────────────────────────→ │
    │ Mostrar respuesta al usuario en WhatsApp                   │
    │                                                             │
```

---

## 🚀 Despliegue

```
┌──────────────────────────────────────────────────────────┐
│                    PRODUCCIÓN                            │
│                                                          │
│  ┌─────────────┐                                         │
│  │   Node.js   │                                         │
│  │   (NestJS)  │◀──────┐                                │
│  └─────────────┘       │                                │
│                        │                                 │
│  ┌─────────────────────┘                                │
│  │  Docker Container                                    │
│  ├──────────────────────────┐                           │
│  │  npm run build           │                           │
│  │  npm run start:prod      │                           │
│  ├──────────────────────────┘                           │
│  │                                                      │
│  └──────────────┬───────────────────────────────────┐   │
│                 │                                    │   │
│  ┌──────────────▼──────────┐                        │   │
│  │   PostgreSQL            │                        │   │
│  │   (Managed DB)          │                        │   │
│  └─────────────────────────┘                        │   │
│                                                      │   │
│  ┌──────────────────────────┐                       │   │
│  │   Ollama Service         │                       │   │
│  │   (Local o Remote)       │                       │   │
│  └─────────────────────────┘                        │   │
│                                                      │   │
│  ┌─────────────────────────────────────────────┐    │   │
│  │  Load Balancer / Reverse Proxy (nginx)      │◀───┤   │
│  │  - TLS/SSL                                  │    │   │
│  │  - Rate Limiting                            │    │   │
│  │  - Logging                                  │    │   │
│  └──────────────┬───────────────────────────────┘    │   │
│                 │                                     │   │
└────────────────┼─────────────────────────────────────┘   │
                 │                                         │
        ┌────────▼────────┐                                │
        │  Internet       │                                │
        │  Webhooks       │                                │
        │  External APIs  │                                │
        └─────────────────┘                                │
```

---

**Diagrama Version:** 1.0  
**Última actualización:** 2026-08-17
