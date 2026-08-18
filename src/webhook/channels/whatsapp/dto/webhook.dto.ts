import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EntryDto } from './entry.dto';

export class WebhookDto {
  @IsString()
  @IsNotEmpty()
  object!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntryDto)
  entry!: EntryDto[];
}
