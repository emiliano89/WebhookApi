# 🚀 Quick Start Guide

Guía rápida para levantar WebhookApi en tu máquina local.

## ⚡ Instalación Rápida (5 minutos)

### 1️⃣ Requisitos Previos

Verificar que tienes instalado:

```bash
# Node.js (>=18.x)
node --version

# npm (>=9.x)
npm --version

# PostgreSQL (>=12)
psql --version

# Ollama (para IA)
ollama --version
```

**No tienes alguno?** Instala desde:
- [Node.js](https://nodejs.org) - Descarga LTS
- [PostgreSQL](https://www.postgresql.org/download)
- [Ollama](https://ollama.ai)

### 2️⃣ Clonar y Configurar

```bash
# Clonar repo
git clone <repository-url>
cd WebhookApi

# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env

# Editar .env con tus credenciales
# Importante: DATABASE_PASSWORD, OLLAMA_HOST, etc.
```

### 3️⃣ Configurar Base de Datos

```bash
# Opción A: Script automático (si está disponible)
npm run db:setup

# Opción B: Manual
psql -U postgres
CREATE DATABASE chatbot_db;
CREATE SCHEMA chatbot;
\q

# Ver docs/DATABASE_SETUP.md para más opciones
```

### 4️⃣ Ollama (IA Local)

```bash
# Terminal 1: Iniciar Ollama
ollama serve

# Terminal 2 (en paralelo): Descargar modelo
ollama pull qwen2.5:7b
```

### 5️⃣ Ejecutar Aplicación

```bash
# En terminal nueva (Terminal 3)
cd WebhookApi
npm run start:dev
```

✅ **La app está corriendo en** http://localhost:3000

---

## 📝 Verificar Instalación

### 1. API está respondiendo

```bash
curl http://localhost:3000/health
# o ir a http://localhost:3000/health en el navegador
```

### 2. Base de datos está conectada

```bash
psql -U postgres -d chatbot_db -c "SELECT COUNT(*) FROM chatbot.businesses;"
```

### 3. Ollama está disponible

```bash
curl http://localhost:11434/api/tags
```

---

## 🧪 Ejecutar Tests

```bash
# Todos los tests
npm test

# Con cobertura
npm run test:cov

# Modo watch (para desarrollo)
npm run test:watch
```

---

## 📚 Próximos Pasos

1. **Leer documentación completa**: [README.md](../README.md)
2. **Entender flujo de webhook**: [README.md - 🔄 Flujo de Webhook](../README.md#-flujo-de-webhook)
3. **Integrar con WhatsApp**: [docs/DATABASE_SETUP.md](./DATABASE_SETUP.md)
4. **Agregar nuevo canal**: [README.md - 🔌 Integración de Nuevo Canal](../README.md#-integración-de-nuevo-canal)

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run start:dev        # Iniciar con hot reload
npm run start:debug      # Iniciar con debugger

# Testing
npm test                 # Ejecutar tests
npm run test:watch      # Tests en watch mode
npm run test:cov        # Ver cobertura

# Linting
npm run lint            # Linter + fix
npm run format          # Formatear código

# Compilación
npm run build           # Compilar para producción
npm run start:prod      # Ejecutar compilado
```

---

## 🐛 Problemas Comunes

### "Cannot connect to database"

```bash
# ✅ Verificar PostgreSQL está corriendo
psql -U postgres -c "SELECT version();"

# ✅ Verificar credenciales en .env
cat .env | grep DATABASE

# ✅ Crear DB si no existe
psql -U postgres -c "CREATE DATABASE chatbot_db;"
```

### "Ollama connection failed"

```bash
# ✅ Verificar Ollama está corriendo
curl http://localhost:11434/api/tags

# ✅ Descargar modelo si no existe
ollama pull qwen2.5:7b

# ✅ Verificar URL en .env
grep OLLAMA_HOST .env
```

### "npm test: No tests found"

```bash
# Limpiar caché de Jest
npm test -- --clearCache

# Ejecutar tests nuevamente
npm test
```

---

## 📖 Más Información

- **Estructura del Proyecto**: Ver [README.md - 🏗️ Arquitectura](../README.md#-arquitectura)
- **Setup Base de Datos**: Ver [docs/DATABASE_SETUP.md](./DATABASE_SETUP.md)
- **API Endpoints**: Ver [README.md - 📝 Endpoints Principales](../README.md#-endpoints-principales)
- **NestJS Docs**: https://docs.nestjs.com

---

## ✅ Checklist de Instalación

- [ ] Node.js instalado
- [ ] npm instalado
- [ ] PostgreSQL instalado y corriendo
- [ ] Ollama instalado y corriendo
- [ ] Repo clonado
- [ ] `npm install` ejecutado
- [ ] `.env` configurado
- [ ] Base de datos creada
- [ ] `npm run start:dev` ejecutando
- [ ] Tests pasando (`npm test`)

¡Listo! 🎉 Ya puedes empezar a desarrollar.
