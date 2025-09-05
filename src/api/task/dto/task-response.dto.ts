import { ApiProperty } from "@nestjs/swagger"
import { BaseResponseDto } from "src/common/dto/base-response.dto"
import { MetaDto } from "src/common/dto/meta.dto"
import { Status } from "../entity/task.entity"
import { Expose } from "class-transformer"

export class TaskResponseDto{
  @ApiProperty({example: 1})
  @Expose()
  id: number

  @ApiProperty({ example: 'NestJS' })
  @Expose()
  title: string

  @ApiProperty({ example: 'Learn NestJS' })
  @Expose()
  description: string

  @ApiProperty({ example: Status.PENDING })
  @Expose()
  status: string

  @ApiProperty({ example: true })
  @Expose()
  isActive: boolean

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date
}

export class TaskResponse extends BaseResponseDto<TaskResponseDto>{}

export class TaskListResponseDto {

  @ApiProperty({type: [TaskResponseDto]})
  items: TaskResponseDto[]
  meta: MetaDto
}

export class TaskListResponse extends BaseResponseDto<TaskListResponseDto>{}