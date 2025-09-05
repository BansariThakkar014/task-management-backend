import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { ResponseService } from 'src/common/services/response.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { User, UserRole } from '../user/entity/user.entity';
import { CustomHttpException } from 'src/common/exception/http-exception';
import { ConfigService } from '@nestjs/config';
import { LoginRequestDto, LoginResponse, LoginResponseDto } from './dto/login.dto';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { MailService } from 'src/common/services/mail.service';
import * as path from 'path';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository,
    private readonly responseService: ResponseService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,

  ) { }

  // Validate Password
  private async validatePassword(password: string, user: User): Promise<boolean> {
    try {
      const passwordMatch = await bcrypt.compare(password, user.password)
      return passwordMatch
    }
    catch {
      return false
    }
  }

  // User Sign Up
  async signUp(body: SignupDto): Promise<BaseResponseDto<null>> {
    const { email, password } = body

    // Checks if user with same email exist or not
    const isExists = await this.userRepository.findOne({ where: { email }, withDeleted: true })
    if (isExists) {
      throw new CustomHttpException(
        'User already exists.',
        HttpStatus.CONFLICT,
        'CONFLICT'
      )
    }

    // Hash password
    const salt = this.configService.get('salt');
    const hashedPassword = await bcrypt.hash(password, salt)

    // Set data
    const data = {
      ...body,
      password: hashedPassword,
      salt
    }

    // Create user
    await this.userRepository.createUser(data);

    // Send mail
    const templatePath = `${process.cwd()}/src/common/templates/user-registration.ejs`;

    await this.mailService.sendMail({
      to: email,
      subject: 'Registration Successful',
      templatePath,
      context: {
        name: `${body.firstName} ${body.lastName}`,
        email,
        password,
        role: UserRole.USER,
      },
    });

    return this.responseService.formatCreated(null, 'User registered successfully.')

  }

  // User Login
  async login(body: LoginRequestDto): Promise<LoginResponse> {
    // Check if the email is true or not
    const user = await this.userRepository.findOneBy({ email: body.email })
    if (!user) {
      throw new CustomHttpException(
        'Invalid email.',
        HttpStatus.UNAUTHORIZED,
        'UNAUTHORIZED'
      )
    }

    // Check if user active or not
    if (!user.isActive) {
      throw new CustomHttpException(
        'User is not active.',
        HttpStatus.UNAUTHORIZED,
        'UNAUTHORIZED'
      )
    }

    // validate Password
    const validatePassword = await this.validatePassword(body.password, user)
    if (!validatePassword) {
      throw new CustomHttpException(
        'Invalid password.',
        HttpStatus.UNAUTHORIZED,
        'UNAUTHORIZED'
      )
    }

    // JWT
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role
    })

    // Set user data
    const userData: UserResponseDto = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: UserRole.USER,
      isActive: user.isActive,
      createdAt: user.createdAt
    }

    // Set login response data
    const loginResponseData: LoginResponseDto = {
      token,
      user: userData
    }

    return this.responseService.formatSuccess(loginResponseData, 'User logged in successfully.')
  }
}
