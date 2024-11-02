import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateTagRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  color: string;
}
