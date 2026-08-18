import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ChangeDto } from './change.dto';

export class EntryDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChangeDto)
  changes!: ChangeDto[];
}
