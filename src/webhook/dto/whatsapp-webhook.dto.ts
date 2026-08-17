import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WhatsAppEntryDto } from './whatsapp-entry.dto';

export class WhatsAppWebhookDto {
  @IsString()
  @IsNotEmpty()
  object!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhatsAppEntryDto)
  entry!: WhatsAppEntryDto[];
}