import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomExceptionFilter } from 'src/common/exception/custom.exception.filter';
import { SignupDto } from './dto/signup.dto';
import { LoginRequestDto, LoginResponse } from './dto/login.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';

@ApiTags('Auth')
@Controller('auth')
@UseFilters(CustomExceptionFilter)
@ApiHeader({
  name: 'Accept-Language',
  description: 'Language for response messages (e.g., en, hi)',
  required: false,
  schema: {
    default: 'en',
    type: 'string',
    enum: ['en', 'hi'],
  },
})
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // Sign Up
  @Post('Signup')
  @ApiOperation({ summary: 'Sign up' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  signUp(@Body() body: SignupDto): Promise<BaseResponseDto<null>> {
    return this.authService.signUp(body)
  }

  // Login
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid email or password.' })
  login(@Body() body: LoginRequestDto): Promise<LoginResponse> {
    return this.authService.login(body)
  }
}
