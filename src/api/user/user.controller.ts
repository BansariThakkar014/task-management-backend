import { Controller, Delete, Get, Param, Query, UseFilters, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomExceptionFilter } from 'src/common/exception/custom.exception.filter';
import { ListUserDto } from './dto/list-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decorators';
import { UserRole } from './entity/user.entity';
import { RolesGuard } from 'src/common/guards/role.guard';
import { CheckUserExistGuard } from 'src/common/guards/check-user-exists.guard';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';

@ApiTags('Users')
@Controller('user')
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
@ApiBearerAuth('JWT-auth')

export class UserController {
  constructor(private readonly userService: UserService) { }

  // Get all users by admin
  @Get()
  @ApiOperation({ summary: 'Get all users by admin' })
  @ApiResponse({ status: 200, description: 'Users fetched successfully.' })
  @UseGuards(JwtAuthGuard, RolesGuard, CheckUserExistGuard)
  @Roles(UserRole.ADMIN)
  getAllUsers(@Query() listUserDto: ListUserDto) {
    return this.userService.getUsers(listUserDto)
  }

  // Delete user by id by admin
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id by admin' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseGuards(JwtAuthGuard, RolesGuard, CheckUserExistGuard)
  @Roles(UserRole.ADMIN)
  deleteUserById(@Param('id') userId: string): Promise<BaseResponseDto<null>> {
    return this.userService.deleteUserById(+userId)
  }
}
