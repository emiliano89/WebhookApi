import {
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WhatsAppProfileDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class WhatsAppContactDto {
  @ValidateNested()
  @Type(() => WhatsAppProfileDto)
  profile!: WhatsAppProfileDto;

  @IsString()
  @IsNotEmpty()
  wa_id!: string;
}