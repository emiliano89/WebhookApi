# 👨‍💻 Guía de Desarrollo

Convenciones y buenas prácticas para desarrollar en WebhookApi.

## 📋 Tabla de Contenidos

- [Estructura de Código](#estructura-de-código)
- [Convenciones de Nombrado](#convenciones-de-nombrado)
- [Crear un Nuevo Módulo](#crear-un-nuevo-módulo)
- [Servicios y Repositorios](#servicios-y-repositorios)
- [Controladores](#controladores)
- [Testing](#testing)
- [Integración de Nuevo Canal](#integración-de-nuevo-canal)

---

## 📁 Estructura de Código

### Formato de Carpeta para Módulo

```
src/nombre-modulo/
├── nombre-modulo.controller.ts      # Controlador (si es necesario)
├── nombre-modulo.service.ts         # Lógica de negocio
├── nombre-modulo.module.ts          # Decorador @Module
├── nombre-entidad.entity.ts         # Entidad TypeORM
├── nombre-modulo.service.spec.ts    # Tests (en test/)
└── index.ts                         # Exportaciones públicas
```

### Árbol de Decisión

```
¿Necesita endpoint HTTP?
  ├─ Sí → Crear Controller + Service
  └─ No → Solo crear Service
```

---

## 🏷️ Convenciones de Nombrado

### Archivos

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Módulo | `nombre.module.ts` | `users.module.ts` |
| Servicio | `nombre.service.ts` | `users.service.ts` |
| Controlador | `nombre.controller.ts` | `users.controller.ts` |
| Entidad | `nombre.entity.ts` | `user.entity.ts` |
| DTO | `create-nombre.dto.ts` | `create-user.dto.ts` |
| Interceptor | `nombre.interceptor.ts` | `logging.interceptor.ts` |
| Guard | `nombre.guard.ts` | `auth.guard.ts` |
| Tests | `nombre.spec.ts` | `users.service.spec.ts` |

### Clases

```typescript
// Servicios: PascalCase + "Service"
export class UsersService { }
export class AuthenticationService { }

// Controladores: PascalCase + "Controller"
export class UsersController { }

// Entidades: PascalCase + "Entity"
export class UserEntity { }

// DTOs: PascalCase + "Dto"
export class CreateUserDto { }
export class UpdateUserDto { }

// Módulos: PascalCase + "Module"
export class UsersModule { }
```

### Variables y Funciones

```typescript
// camelCase
const userName = "John";
const getUserById = (id: string) => { };

// Métodos de servicio
async findById(id: string): Promise<User> { }
async create(data: CreateUserDto): Promise<User> { }
async update(id: string, data: UpdateUserDto): Promise<User> { }
async delete(id: string): Promise<void> { }
```

---

## 🔨 Crear un Nuevo Módulo

### Paso 1: Generar Scaffolding

```bash
# Usando NestJS CLI
nest g module users
nest g service users --no-spec
nest g controller users --no-spec
```

### Paso 2: Crear Entidad

```typescript
// src/users/user.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  schema: 'chatbot',
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ length: 150 })
  name!: string;

  @Column({ length: 150, unique: true })
  email!: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
```

### Paso 3: Crear Servicio

```typescript
// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async create(data: CreateUserDto): Promise<UserEntity> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.repository.findOneBy({ id });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.repository.find();
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
```

### Paso 4: Crear Módulo

```typescript
// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
```

### Paso 5: Exportar en app.module.ts

```typescript
// src/app.module.ts
@Module({
  imports: [
    // ... otros módulos
    UsersModule,
  ],
})
export class AppModule {}
```

---

## 🛠️ Servicios y Repositorios

### Patrón de Servicio

```typescript
@Injectable()
export class ExampleService {
  constructor(
    @InjectRepository(ExampleEntity)
    private readonly repository: Repository<ExampleEntity>,
    private readonly otherService: OtherService,
  ) {}

  // Crear
  async create(data: CreateExampleDto): Promise<ExampleEntity> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  // Leer uno
  async findById(id: string): Promise<ExampleEntity | null> {
    return this.repository.findOneBy({ id });
  }

  // Leer múltiples
  async findAll(query?: FilterQuery): Promise<ExampleEntity[]> {
    const qb = this.repository.createQueryBuilder('entity');
    
    if (query?.name) {
      qb.where('entity.name ILIKE :name', { name: `%${query.name}%` });
    }
    
    return qb.getMany();
  }

  // Actualizar
  async update(
    id: string,
    data: UpdateExampleDto,
  ): Promise<ExampleEntity> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new NotFoundException(`Entidad con id ${id} no encontrada`);
    }
    return updated;
  }

  // Eliminar
  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Entidad con id ${id} no encontrada`);
    }
  }
}
```

### Transacciones

```typescript
async findOrCreate(
  businessId: string,
  data: CreateData,
): Promise<Result> {
  return this.dataSource.transaction(async (manager) => {
    const repository = manager.getRepository(Entity);
    
    // Buscar existente
    const existing = await repository.findOne({
      where: { businessId },
    });

    if (existing) {
      return existing;
    }

    // Crear nuevo
    const entity = repository.create(data);
    return repository.save(entity);
  });
}
```

---

## 🎯 Controladores

### Patrón de Controlador

```typescript
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ExampleService } from './example.service';
import { CreateExampleDto } from './dto/create-example.dto';

@Controller('examples')
export class ExampleController {
  constructor(private readonly service: ExampleService) {}

  @Post()
  async create(@Body() data: CreateExampleDto) {
    return this.service.create(data);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const result = await this.service.findById(id);
    if (!result) {
      throw new NotFoundException(`Ejemplo ${id} no encontrado`);
    }
    return result;
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
    return { message: 'Eliminado exitosamente' };
  }
}
```

---

## 🧪 Testing

### Patrón de Test

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExampleService } from './example.service';
import { ExampleEntity } from './example.entity';

describe('ExampleService', () => {
  let service: ExampleService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExampleService,
        {
          provide: getRepositoryToken(ExampleEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ExampleService>(ExampleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create new entity', async () => {
      const data = { name: 'Test' };
      const entity = { id: '1', ...data };

      mockRepository.create.mockReturnValue(data);
      mockRepository.save.mockResolvedValue(entity);

      const result = await service.create(data);

      expect(result).toEqual(entity);
      expect(mockRepository.create).toHaveBeenCalledWith(data);
      expect(mockRepository.save).toHaveBeenCalledWith(data);
    });
  });
});
```

### Ejecutar Tests

```bash
# Todos
npm test

# Archivo específico
npm test -- example.service

# Con cobertura
npm run test:cov

# Watch mode
npm run test:watch
```

---

## 🔌 Integración de Nuevo Canal

### 1. Crear Adaptador

```typescript
// src/webhook/adapters/telegram.adapter.ts
import { Injectable } from '@nestjs/common';
import { ChannelAdapter } from './channel.adapter';
import { NormalizedWebhookEvent } from '../models/normalized-webhook-event';

@Injectable()
export class TelegramAdapter implements ChannelAdapter {
  normalize(body: unknown): NormalizedWebhookEvent {
    const data = body as any;
    
    return {
      type: data.message ? 'MESSAGE' : 'STATUS',
      channel: 'telegram',
      externalUserId: data.message?.from?.id?.toString(),
      externalMessageId: data.message?.message_id?.toString(),
      text: data.message?.text,
      metadata: {
        phoneNumberId: data.message?.chat?.id?.toString(),
        displayName: data.message?.from?.first_name,
      },
    };
  }
}
```

### 2. Registrar en Registry

```typescript
// src/webhook/registry/channel-registry.service.ts
@Injectable()
export class ChannelRegistryService {
  constructor(
    private readonly whatsappAdapter: WhatsAppAdapter,
    private readonly telegramAdapter: TelegramAdapter,
  ) {}

  getAdapter(channel: string): ChannelAdapter {
    switch (channel) {
      case 'whatsapp':
        return this.whatsappAdapter;
      case 'telegram':
        return this.telegramAdapter;
      default:
        throw new BadRequestException(`Canal no soportado: ${channel}`);
    }
  }
}
```

### 3. Registrar en Módulo

```typescript
// src/webhook/webhook.module.ts
@Module({
  // ...
  providers: [
    WebhookService,
    WhatsAppAdapter,
    TelegramAdapter,
    ChannelRegistryService,
  ],
})
export class WebhookModule {}
```

---

## 📌 Buenas Prácticas

### 1. Error Handling

```typescript
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

// ✅ Correcto
if (!user) {
  throw new NotFoundException('Usuario no encontrado');
}

// ❌ Evitar
if (!user) {
  throw new Error('Usuario no encontrado');
}
```

### 2. Validación de DTOs

```typescript
import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;
}

// En controller
@Post()
async create(@Body() data: CreateUserDto) {
  // TypeScript y NestJS validan automáticamente
}
```

### 3. Logging

```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class ExampleService {
  private readonly logger = new Logger(ExampleService.name);

  async findById(id: string) {
    this.logger.debug(`Buscando entidad con id: ${id}`);
    const result = await this.repository.findOneBy({ id });
    
    if (!result) {
      this.logger.warn(`Entidad no encontrada: ${id}`);
    }
    
    return result;
  }
}
```

### 4. Tipado Fuerte

```typescript
// ✅ Correcto
async findById(id: string): Promise<UserEntity | null> {
  return this.repository.findOneBy({ id });
}

// ❌ Evitar
async findById(id) {
  return this.repository.findOneBy({ id });
}
```

---

## 📚 Recursos

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Class Validator](https://github.com/typestack/class-validator)

---

## ✅ Checklist antes de hacer commit

- [ ] Código sigue convenciones de nombrado
- [ ] Tests escritos para funcionalidad nueva
- [ ] Tests pasan (`npm test`)
- [ ] Linting pasa (`npm run lint`)
- [ ] DTOs validados con `class-validator`
- [ ] Errores manejados correctamente
- [ ] Logs añadidos si es necesario
- [ ] Documentado en comentarios si es complejo
