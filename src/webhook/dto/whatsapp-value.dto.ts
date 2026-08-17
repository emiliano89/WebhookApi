import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { WhatsAppMetadataDto } from './whatsapp-metadata.dto';
import { WhatsAppContactDto } from './whatsapp-contact.dto';
import { WhatsAppMessageDto } from './whatsapp-message.dto';
import { WhatsAppStatusDto } from './whatsapp-status.dto';

export class WhatsAppValueDto {
  @IsString()
  @IsNotEmpty()
  messaging_product!: string;

  @ValidateNested()
  @Type(() => WhatsAppMetadataDto)
  metadata!: WhatsAppMetadataDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhatsAppContactDto)
  contacts?: WhatsAppContactDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhatsAppMessageDto)
  messages?: WhatsAppMessageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhatsAppStatusDto)
  statuses?: WhatsAppStatusDto[];
}