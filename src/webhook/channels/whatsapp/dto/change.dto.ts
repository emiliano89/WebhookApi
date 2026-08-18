import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ValueDto } from './value.dto';

export class ChangeDto {
  @IsString()
  @IsNotEmpty()
  field!: string;

  @ValidateNested()
  @Type(() => ValueDto)
  value!: ValueDto;
}
