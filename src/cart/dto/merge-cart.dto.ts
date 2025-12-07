import { IsArray, IsInt, Min } from 'class-validator';
import { AddItemDto } from './add-item.dto';

export class MergeCartDto {
  @IsInt()
  @Min(1)
  userId: number;     

  @IsArray()
  items: AddItemDto[];
}
