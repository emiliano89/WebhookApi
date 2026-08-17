import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class WhatsAppStatusDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsString()
  @IsNotEmpty()
  timestamp!: string;

  @IsString()
  @IsNotEmpty()
  recipient_id!: string;

  @IsOptional()
  @IsString()
  conversation_id?: string;
}