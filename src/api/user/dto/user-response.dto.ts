import { ApiProperty } from "@nestjs/swagger"
import { BaseResponseDto } from "src/common/dto/base-response.dto"
import { MetaDto } from "src/common/dto/meta.dto"
import { UserRole } from "../entity/user.entity"
import { Expose } from "class-transformer"

export class UserResponseDto{
  @ApiProperty({example: 1})
  @Expose()
  id: number

  @ApiProperty({ example: 'Bansari' })
  @Expose()
  firstName: string

  @ApiProperty({ example: 'Thakkar' })
  @Expose()
  lastName: string

  @ApiProperty({ example: 'bansari.thakkar@bytestechnolab.com' })
  @Expose()
  email: string

  @ApiProperty({ example: UserRole.USER })
  @Expose()
  role: UserRole.USER

  @ApiProperty({ example: true })
  @Expose()
  isActive: boolean

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  createdAt: Date
}

export class UserResponse extends BaseResponseDto<UserResponseDto>{}

export class UserListResponseDto {

  @ApiProperty({type: [UserResponseDto]})
  items: UserResponseDto[]
  meta: MetaDto
}

export class UserListResponse extends BaseResponseDto<UserListResponseDto>{}