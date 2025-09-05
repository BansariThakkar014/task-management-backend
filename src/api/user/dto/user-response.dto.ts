import { ApiProperty } from "@nestjs/swagger"
import { BaseResponseDto } from "src/common/dto/base-response.dto"
import { MetaDto } from "src/common/dto/meta.dto"
import { UserRole } from "../entity/user.entity"

export class UserResponseDto{
  @ApiProperty({example: 1})
  id: number

  @ApiProperty({ example: 'Bansari' })
  firstName: string

  @ApiProperty({ example: 'Thakkar' })
  lastName: string

  @ApiProperty({ example: 'bansari.thakkar@bytestechnolab.com' })
  email: string

  @ApiProperty({ example: UserRole.USER })
  role: UserRole.USER

  @ApiProperty({ example: true })
  isActive: boolean

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date
}

export class UserResponse extends BaseResponseDto<UserResponseDto>{}

export class UserListResponseDto {

  @ApiProperty({type: [UserResponseDto]})
  items: UserResponseDto[]
  meta: MetaDto
}

export class UserListResponse extends BaseResponseDto<UserListResponseDto>{}