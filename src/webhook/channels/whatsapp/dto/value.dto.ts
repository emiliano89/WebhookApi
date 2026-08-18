import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { MetadataDto } from './metadata.dto';
import { ContactDto } from './contact.dto';
import { MessageDto } from './message.dto';
import { StatusDto } from './status.dto';

export class ValueDto {
  @IsString()
  @IsNotEmpty()
  messaging_product!: string;

  @ValidateNested()
  @Type(() => MetadataDto)
  metadata!: MetadataDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts?: ContactDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages?: MessageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatusDto)
  statuses?: StatusDto[];
}
