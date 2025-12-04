import { IsArray } from 'class-validator';
import { AddItemDto } from './add-item.dto';

export class MergeCartDto {
  @IsArray()
  items: AddItemDto[];
}
