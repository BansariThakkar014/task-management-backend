import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseFilters, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomExceptionFilter } from 'src/common/exception/custom.exception.filter';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto';
import { RequestUser } from 'src/common/dto/request-user.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { ListTaskDto } from './dto/list-task.dto';
import { CheckUserExistGuard } from 'src/common/guards/check-user-exists.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decorators';
import { UserRole } from '../user/entity/user.entity';
import { TaskListResponse, TaskResponse } from './dto/task-response.dto';

@ApiTags('Tasks')
@Controller('task')
@UseFilters(CustomExceptionFilter)
// @ApiHeader({ name: 'Authorization', required: true })
@ApiBearerAuth('JWT-auth')

export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  // Create task
  @Post()
  @ApiOperation({ summary: 'Create task by logged in user' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  @ApiResponse({ status: 409, description: 'Task already exists.' })
  @UseGuards(JwtAuthGuard, RolesGuard, CheckUserExistGuard)
  @Roles(UserRole.USER)
  createTask(@Body() body: CreateTaskDto, @Req() req: RequestUser): Promise<BaseResponseDto<null>> {
    return this.taskService.createTask(body, +req.user.sub)
  }

  // Get all tasks by logged in user
  @Get()
  @ApiOperation({ summary: 'Get all tasks by logged in user' })
  @ApiResponse({ status: 200, description: 'Tasks fetched successfully.' })
  @UseGuards(JwtAuthGuard, RolesGuard, CheckUserExistGuard)
  @Roles(UserRole.USER)
  getAllTasks(@Query() listTaskDto: ListTaskDto, @Req() req: RequestUser): Promise<TaskListResponse> {
    return this.taskService.getAllTasks(listTaskDto, +req.user.sub)
  }

  // Get task by id by logged in user
  @Get(':id')
  @ApiOperation({ summary: 'Get task by logged in user' })
  @ApiResponse({ status: 200, description: 'Task fetched successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @UseGuards(JwtAuthGuard, RolesGuard, CheckUserExistGuard)
  @Roles(UserRole.USER)
  getTaskById(@Param('id') taskId: string, @Req() req: RequestUser): Promise<TaskResponse> {
    return this.taskService.getTaskById(+taskId, +req.user.sub)
  }

  // Get all tasks from user id by admin
  @Get('user/:id')
  @ApiOperation({ summary: 'Get particular user tasks by admin' })
  @ApiResponse({ status: 200, description: 'Tasks fetched successfully.' })
  @UseGuards(JwtAuthGuard, RolesGuard, CheckUserExistGuard)
  @Roles(UserRole.ADMIN)
  getUserTask(@Query() listTaskDto: ListTaskDto, @Param('id') userId: string): Promise<TaskListResponse> {
    return this.taskService.getUserTask(listTaskDto, +userId)
  }

  // Update task by id by logged in user
  @Patch(':id')
  @ApiOperation({ summary: 'Update task by logged in user' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 200, description: 'Task updated successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @UseGuards(JwtAuthGuard, RolesGuard, CheckUserExistGuard)
  @Roles(UserRole.USER)
  updateTaskById(@Param('id') taskId: string, @Body() body: UpdateTaskDto, @Req() req: RequestUser): Promise<BaseResponseDto<null>> {
    return this.taskService.updateTaskById(+taskId, body, +req.user.sub)
  }

  // Delete task by id by logged in user
  @Delete(':id')
  @ApiOperation({ summary: 'Delete task by logged in user' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @UseGuards(JwtAuthGuard, RolesGuard, CheckUserExistGuard)
  @Roles(UserRole.USER)
  deleteTaskById(@Param('id') taskId: string, @Req() req: RequestUser): Promise<BaseResponseDto<null>> {
    return this.taskService.deleteTaskByLoggedInUserId(+taskId, +req.user.sub)
  }

  // Delete task by admin
  @Delete('admin/:id')
  @ApiOperation({ summary: 'Delete task by admin' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @UseGuards(JwtAuthGuard, RolesGuard, CheckUserExistGuard)
  @Roles(UserRole.ADMIN)
  deleteTaskByAdmin(@Param('id') taskId: string) {
    return this.taskService.deleteTaskByAdmin(+taskId)
  }
}
