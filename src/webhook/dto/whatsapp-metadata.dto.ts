import { IsNotEmpty, IsString } from 'class-validator';

export class WhatsAppMetadataDto {
  @IsString()
  @IsNotEmpty()
  display_phone_number!: string;

  @IsString()
  @IsNotEmpty()
  phone_number_id!: string;
}