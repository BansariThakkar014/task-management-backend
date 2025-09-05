import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class CreateTaskDto {
  @ApiProperty({ example: 'NestJS' })
  @IsString({ message: 'Please enter a valid title' })
  @IsNotEmpty({ message: 'Title should not be empty' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  title: string

  @ApiProperty({ example: 'Learn NestJS' })
  @IsString({ message: 'Please enter a valid title' })
  description: string

}

export class UpdateTaskDto extends PartialType(CreateTaskDto) { } 