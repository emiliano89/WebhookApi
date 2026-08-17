import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WhatsAppTextDto {
  @IsString()
  @IsNotEmpty()
  body!: string;
}

export class WhatsAppMessageDto {
  @IsString()
  @IsNotEmpty()
  from!: string;

  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  timestamp!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => WhatsAppTextDto)
  text?: WhatsAppTextDto;
}