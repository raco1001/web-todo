import { IsBoolean } from 'class-validator';

export class UpdateListStatusDto {
  @IsBoolean()
  status: boolean;
}
