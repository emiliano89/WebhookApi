# 📚 Documentación WebhookApi

Índice completo de documentación del proyecto.

## 📖 Documentos Principales

### 1. [README.md](../README.md) - Documentación General
Descripción completa del proyecto incluyendo:
- 🎯 Descripción general
- 🏗️ Arquitectura y estructura
- 📦 Stack tecnológico
- 🚀 Instalación y configuración
- 🧪 Tests
- 🔄 Flujo de webhook
- 🔌 Integración de nuevo canal
- 📝 Endpoints principales

**👉 Comienza aquí si es tu primer contacto con el proyecto**

---

### 2. [QUICK_START.md](./QUICK_START.md) - Guía Rápida (⏱️ 5 minutos)
Instrucciones paso a paso para levantar la aplicación:
- ⚡ Instalación rápida
- 1️⃣ Requisitos previos
- 2️⃣ Clonar y configurar
- 3️⃣ Base de datos
- 4️⃣ Ollama (IA)
- 5️⃣ Ejecutar aplicación
- ✅ Verificación
- 🧪 Tests
- 🐛 Problemas comunes

**👉 Usa esta guía para configurar tu entorno de desarrollo**

---

### 3. [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Configuración de Base de Datos
Guía completa para PostgreSQL:
- 🗄️ Requisitos
- 📥 Instalación por SO
- 🔧 Crear BD y schema
- ✅ Verificación de conexión
- 💾 Backup y restore
- 🐛 Troubleshooting

**👉 Consulta aquí si tienes problemas con PostgreSQL**

---

### 4. [DEVELOPMENT.md](./DEVELOPMENT.md) - Guía de Desarrollo
Estándares y convenciones para desarrolladores:
- 📁 Estructura de código
- 🏷️ Convenciones de nombrado
- 🔨 Crear nuevo módulo
- 🛠️ Servicios y repositorios
- 🎯 Controladores
- 🧪 Testing
- 🔌 Integración de canal
- 📌 Buenas prácticas

**👉 Lee esta guía antes de escribir código nuevo**

---

### 5. [ARCHITECTURE.md](./ARCHITECTURE.md) - Diagramas y Arquitectura
Visualización de flujos y arquitectura:
- 🔄 Flujo de procesamiento de webhook
- 🗄️ Modelo de datos relacional
- 🏗️ Arquitectura de capas
- 🔐 Ciclo de vida de conversación
- 📊 Integración con servicios externos
- 🚀 Despliegue en producción

**👉 Consulta aquí para entender la arquitectura visual**

### 6. [WEBHOOK_GUIDE.md](./WEBHOOK_GUIDE.md) - Guía de Webhooks
Documentación detallada de la arquitectura escalable de webhooks:
- 🗂️ Estructura de directorios
- 🧩 Componentes principales
- 🚀 Cómo agregar un nuevo canal
- 📱 Ejemplo completo: WhatsApp
- 📌 Best practices
- 🧪 Testing

**👉 Lee esto antes de agregar nuevos canales (Facebook, Instagram, etc.)**

---

## 🗂️ Árbol de Documentación

```
📦 WebhookApi/
├── 📄 README.md                    ← Documentación principal
├── 📄 .env.example                 ← Ejemplo de configuración
├── 📁 docs/                        ← Esta carpeta
│   ├── 📄 INDEX.md                 ← (Este archivo)
│   ├── 📄 QUICK_START.md           ← Guía rápida
│   ├── 📄 DATABASE_SETUP.md        ← Configuración BD
│   ├── 📄 DEVELOPMENT.md           ← Guía de desarrollo
│   ├── 📄 ARCHITECTURE.md          ← Diagramas y flujos
│   └── 📄 WEBHOOK_GUIDE.md         ← Guía de webhooks escalables
├── 📁 src/                         ← Código fuente
├── 📁 test/                        ← Tests unitarios
└── 📁 coverage/                    ← Reporte de cobertura
```

---

## 🎯 Guía Rápida por Rol

### 👤 Nuevo Desarrollador

1. Leer [README.md](../README.md) - Entender el proyecto
2. Seguir [QUICK_START.md](./QUICK_START.md) - Instalar localmente
3. Revisar [DEVELOPMENT.md](./DEVELOPMENT.md) - Entender convenciones
4. Ejecutar `npm test` - Verificar setup

**Tiempo estimado: 30 minutos**

---

### 🛠️ Desarrollador Backend

1. [DEVELOPMENT.md](./DEVELOPMENT.md) - Estándares del código
2. [README.md - API Endpoints](../README.md#-endpoints-principales)
3. [README.md - Flujo de Webhook](../README.md#-flujo-de-webhook)
4. Revisar `test/` - Entender test patterns

**Área de enfoque: `src/`**

---

### 🤝 DevOps / Infra

1. [README.md - Stack Tecnológico](../README.md#stack-tecnológico)
2. [DATABASE_SETUP.md](./DATABASE_SETUP.md) - BD
3. [QUICK_START.md - Requisitos](./QUICK_START.md#1️⃣-requisitos-previos)
4. [README.md - Despliegue](../README.md#-despliegue)

**Área de enfoque: BD, Ollama, Docker**

---

### 🧪 QA / Tester

1. [QUICK_START.md - Ejecutar Tests](./QUICK_START.md#-ejecutar-tests)
2. [README.md - Tests](../README.md#-tests)
3. [DEVELOPMENT.md - Testing](./DEVELOPMENT.md#-testing)
4. Revisar cobertura: `npm run test:cov`

**Área de enfoque: `test/`**

---

## 🔍 Búsqueda Rápida

### Quiero saber cómo...

#### Instalar el proyecto
→ [QUICK_START.md](./QUICK_START.md#1️⃣-requisitos-previos)

#### Configurar la base de datos
→ [DATABASE_SETUP.md](./DATABASE_SETUP.md)

#### Crear un nuevo módulo
→ [DEVELOPMENT.md - Crear Nuevo Módulo](./DEVELOPMENT.md#-crear-un-nuevo-módulo)

#### Entender el flujo de webhook
→ [README.md - Flujo de Webhook](../README.md#-flujo-de-webhook)

#### Integrar un nuevo canal (Facebook, Instagram, etc.)
→ [WEBHOOK_GUIDE.md - Cómo Agregar un Canal](./WEBHOOK_GUIDE.md#-cómo-agregar-un-canal)
→ [README.md - Integración de Nuevo Canal](../README.md#-integración-de-nuevo-canal)

#### Entender la arquitectura de webhooks
→ [WEBHOOK_GUIDE.md](./WEBHOOK_GUIDE.md)
→ [ARCHITECTURE.md - Flujo de Webhook](./ARCHITECTURE.md#-flujo-de-procesamiento-de-webhook)

#### Escribir un test
→ [DEVELOPMENT.md - Testing](./DEVELOPMENT.md#-testing)

#### Solucionar un problema
→ [README.md - Troubleshooting](../README.md#-troubleshooting)
→ [QUICK_START.md - Problemas Comunes](./QUICK_START.md#-problemas-comunes)

#### Entender la arquitectura
→ [README.md - Arquitectura](../README.md#-arquitectura)

#### Hacer deploy a producción
→ [README.md - Despliegue](../README.md#-despliegue)

---

## 📞 Contacto y Soporte

- **Problemas técnicos**: Revisar [Troubleshooting](#búsqueda-rápida) 
- **Dudas sobre código**: Ver [DEVELOPMENT.md](./DEVELOPMENT.md)
- **Dudas sobre BD**: Ver [DATABASE_SETUP.md](./DATABASE_SETUP.md)

---

## 📈 Próximas Características Documentadas

- [ ] Autenticación y autorización
- [ ] Rate limiting
- [ ] Caché
- [ ] Logging avanzado
- [ ] Monitoreo y alertas
- [ ] CI/CD setup
- [ ] Docker Compose

---

## 📝 Changelog

### v1.0.0 (2026-08-17)
- ✅ README.md completo
- ✅ QUICK_START.md
- ✅ DATABASE_SETUP.md
- ✅ DEVELOPMENT.md
- ✅ .env.example
- ✅ Tests unitarios (33 tests)

---

## 📄 Licencia

UNLICENSED

---

**Última actualización:** 2026-08-17  
**Versión:** 1.0.0
