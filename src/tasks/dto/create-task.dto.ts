import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  isCompleted: boolean;
}
