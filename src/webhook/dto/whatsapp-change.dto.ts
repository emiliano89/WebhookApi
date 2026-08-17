import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WhatsAppValueDto } from './whatsapp-value.dto';

export class WhatsAppChangeDto {
  @IsString()
  @IsNotEmpty()
  field!: string;

  @ValidateNested()
  @Type(() => WhatsAppValueDto)
  value!: WhatsAppValueDto;
}