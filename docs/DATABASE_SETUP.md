# 🗄️ Configuración de Base de Datos

## Requisitos

- PostgreSQL >= 12
- Cliente psql instalado

## Instalación de PostgreSQL

### Windows
1. Descargar desde https://www.postgresql.org/download/windows/
2. Ejecutar instalador
3. Recordar la contraseña de `postgres`
4. Agregar PostgreSQL al PATH

### macOS
```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Crear Base de Datos y Schema

### Opción 1: Usando psql (Recomendado)

```bash
# Conectarse como usuario postgres
psql -U postgres

# Crear base de datos
CREATE DATABASE chatbot_db;

# Conectarse a la base de datos
\c chatbot_db

# Crear esquema
CREATE SCHEMA chatbot;

# Crear usuario dedicado (opcional)
CREATE USER chatbot_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE chatbot_db TO chatbot_user;
GRANT ALL PRIVILEGES ON SCHEMA chatbot TO chatbot_user;

# Salir
\q
```

### Opción 2: Script SQL

Crear archivo `init.sql`:

```sql
-- Crear base de datos
CREATE DATABASE chatbot_db;

-- Conectar a la base de datos (requiere ejecutar en sesión separada)
-- \c chatbot_db

-- Crear esquema
CREATE SCHEMA chatbot;

-- Crear tablas
CREATE TABLE chatbot.businesses (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chatbot.customers (
  id BIGSERIAL PRIMARY KEY,
  business_id BIGINT NOT NULL REFERENCES chatbot.businesses(id),
  name VARCHAR(150),
  email VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chatbot.channels (
  id BIGSERIAL PRIMARY KEY,
  business_id BIGINT NOT NULL REFERENCES chatbot.businesses(id),
  type VARCHAR(30),
  external_id VARCHAR(255),
  name VARCHAR(100),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chatbot.channel_contacts (
  id BIGSERIAL PRIMARY KEY,
  channel_id BIGINT NOT NULL REFERENCES chatbot.channels(id),
  customer_id BIGINT NOT NULL REFERENCES chatbot.customers(id),
  external_id VARCHAR(255),
  display_name VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chatbot.conversations (
  id BIGSERIAL PRIMARY KEY,
  business_id BIGINT NOT NULL REFERENCES chatbot.businesses(id),
  customer_id BIGINT NOT NULL REFERENCES chatbot.customers(id),
  channel_id BIGINT NOT NULL REFERENCES chatbot.channels(id),
  status VARCHAR(30) DEFAULT 'OPEN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP
);

CREATE TABLE chatbot.messages (
  id BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT NOT NULL REFERENCES chatbot.conversations(id),
  channel_id BIGINT NOT NULL REFERENCES chatbot.channels(id),
  external_message_id VARCHAR(255),
  role VARCHAR(20),
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chatbot.services (
  id BIGSERIAL PRIMARY KEY,
  business_id BIGINT NOT NULL REFERENCES chatbot.businesses(id),
  name VARCHAR(150),
  description TEXT,
  price NUMERIC(12, 2),
  duration_minutes INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices
CREATE INDEX idx_customers_business ON chatbot.customers(business_id);
CREATE INDEX idx_channels_business ON chatbot.channels(business_id);
CREATE INDEX idx_channels_external ON chatbot.channels(type, external_id);
CREATE INDEX idx_channel_contacts_channel ON chatbot.channel_contacts(channel_id);
CREATE INDEX idx_channel_contacts_external ON chatbot.channel_contacts(channel_id, external_id);
CREATE INDEX idx_conversations_business ON chatbot.conversations(business_id);
CREATE INDEX idx_conversations_customer ON chatbot.conversations(customer_id);
CREATE INDEX idx_messages_conversation ON chatbot.messages(conversation_id);
CREATE INDEX idx_services_business ON chatbot.services(business_id);
```

Ejecutar:
```bash
psql -U postgres -f init.sql
```

## Verificar Conexión

```bash
# Conectarse a la base de datos
psql -U postgres -d chatbot_db -h localhost -p 5432

# Listar tablas del esquema
\dt chatbot.*

# Mostrar estructura de una tabla
\d chatbot.customers

# Salir
\q
```

## Configurar Variables de Entorno

Actualizar `.env`:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=chatbot_db
```

## Troubleshooting

### Error: "cannot connect to server"

**Solución:**
```bash
# Verificar que PostgreSQL está corriendo
sudo systemctl status postgresql  # Linux
brew services list                # macOS
# En Windows, verificar en Services

# Reiniciar si es necesario
sudo systemctl restart postgresql
```

### Error: "password authentication failed"

**Solución:**
```bash
# Resetear contraseña de postgres
psql -U postgres

ALTER USER postgres PASSWORD 'new_password';
\q
```

### Error: "database does not exist"

**Solución:**
```bash
# Crear la base de datos
psql -U postgres -c "CREATE DATABASE chatbot_db;"
```

## Backup y Restore

### Backup

```bash
# Backup completo
pg_dump -U postgres chatbot_db > backup.sql

# Backup comprimido
pg_dump -U postgres chatbot_db | gzip > backup.sql.gz
```

### Restore

```bash
# Restore desde archivo
psql -U postgres chatbot_db < backup.sql

# Restore desde archivo comprimido
gunzip -c backup.sql.gz | psql -U postgres chatbot_db
```

## Verificar Estado de Base de Datos

```sql
-- Conectarse a chatbot_db
psql -U postgres -d chatbot_db

-- Ver tablas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'chatbot';

-- Ver registros por tabla
SELECT 'businesses' as table_name, COUNT(*) as count FROM chatbot.businesses
UNION ALL
SELECT 'customers', COUNT(*) FROM chatbot.customers
UNION ALL
SELECT 'channels', COUNT(*) FROM chatbot.channels
UNION ALL
SELECT 'conversations', COUNT(*) FROM chatbot.conversations
UNION ALL
SELECT 'messages', COUNT(*) FROM chatbot.messages
UNION ALL
SELECT 'services', COUNT(*) FROM chatbot.services;
```

## Recursos

- [PostgreSQL Official Documentation](https://www.postgresql.org/docs)
- [PostgreSQL Download](https://www.postgresql.org/download)
- [pgAdmin Web Interface](https://www.pgadmin.org)
