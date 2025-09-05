import { ApiProperty } from "@nestjs/swagger"
import { IsAlpha, IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator"

export class SignupDto {

  @ApiProperty({ example: 'Bansari', required: true, description: 'First name' })
  @IsAlpha(undefined, { message: 'Please enter a valid name' })
  @MinLength(2, { message: 'First name should be at least 2 characters' })
  firstName: string

  @ApiProperty({ example: 'Thakkar', required: true, description: 'Last name' })
  @IsAlpha(undefined, { message: 'Please enter a valid name' })
  @MinLength(2, { message: 'First name should be at least 2 characters' })
  lastName: string

  @ApiProperty({ example: 'bansari.thakkar@bytestechnolab.com', required: true, description: 'Email' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail(undefined, { message: 'Please enter a valid email' })
  email: string

  @ApiProperty({ example: 'Bansari@123' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\]{};':"\\|,.<>?]).{8,}$/,
    {
      message:
        'Password should be at least 8 characters and can contain special characters, alphabets and numbers.',
    },)
    password: string
}