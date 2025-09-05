import { ApiProperty } from "@nestjs/swagger"
import { BaseResponseDto } from "src/common/dto/base-response.dto"
import { MetaDto } from "src/common/dto/meta.dto"
import { Status } from "../entity/task.entity"

export class TaskResponseDto{
  @ApiProperty({example: 1})
  id: number

  @ApiProperty({ example: 'NestJS' })
  title: string

  @ApiProperty({ example: 'Learn NestJS' })
  description: string

  @ApiProperty({ example: Status.PENDING })
  status: string

  @ApiProperty({ example: true })
  isActive: boolean

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date
}

export class TaskResponse extends BaseResponseDto<TaskResponseDto>{}

export class TaskListResponseDto {

  @ApiProperty({type: [TaskResponseDto]})
  items: TaskResponseDto[]
  meta: MetaDto
}

export class TaskListResponse extends BaseResponseDto<TaskListResponseDto>{}