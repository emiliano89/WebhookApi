import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TextDto {
  @IsString()
  @IsNotEmpty()
  body!: string;
}

export class MessageDto {
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
  @Type(() => TextDto)
  text?: TextDto;
}
