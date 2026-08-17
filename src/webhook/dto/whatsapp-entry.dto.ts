import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WhatsAppChangeDto } from './whatsapp-change.dto';

export class WhatsAppEntryDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhatsAppChangeDto)
  changes!: WhatsAppChangeDto[];
}