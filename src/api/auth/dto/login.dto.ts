import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "../../user/entity/user.entity"
import { BaseResponseDto } from "src/common/dto/base-response.dto"
import { IsEmail, IsNotEmpty, Matches } from "class-validator"

export class LoginRequestDto {
  @ApiProperty({ example: 'admin@gmail.com' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail(undefined, { message: 'Please enter a valid email' })
  email: string

  @ApiProperty({ example: 'Super@1234' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\]{};':"\\|,.<>?]).{8,}$/,
    {
      message:
        'Password should be at least 8 characters and can contain special characters, alphabets and numbers.',
    },)
  password: string
}

export class LoginResponseDto {
  @ApiProperty({ example: 'sdfcwuiqopowkdbjqwewfgh' })
  token: string

  @ApiProperty({
    example: {
      id: 1,
      firstName: 'Bansari',
      lastName: 'Thakkar',
      email: 'bansari.thakkar@bytestechnolab.com',
      role: 'user',
      isActive: true
    }
  })
  user: {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    role: UserRole,
    isActive: boolean
  }
}

export class LoginResponse extends BaseResponseDto<LoginResponseDto> { }