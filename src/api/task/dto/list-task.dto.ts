import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ListTaskDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsString({
    message: 'Search must be a string.',
  })
  @IsOptional()
  search?: string;

}
