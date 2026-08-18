import {
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProfileDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class ContactDto {
  @ValidateNested()
  @Type(() => ProfileDto)
  profile!: ProfileDto;

  @IsString()
  @IsNotEmpty()
  wa_id!: string;
}
