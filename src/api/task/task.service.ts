import { HttpStatus, Injectable } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { ResponseService } from 'src/common/services/response.service';
import { UserRepository } from '../user/user.repository';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { CustomHttpException } from 'src/common/exception/http-exception';
import { ListTaskDto } from './dto/list-task.dto';
import { TaskListResponse, TaskResponse, TaskResponseDto } from './dto/task-response.dto';
import { Status } from './entity/task.entity';
import { Not } from 'typeorm';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository,
    private readonly userRepository: UserRepository,
    private readonly responseService: ResponseService,
    private readonly i18n: I18nService
  ) { }

  // Create tasks by logged in user
  async createTask(body: CreateTaskDto, loggedInUserId: number): Promise<BaseResponseDto<null>> {
    // Check if task already exists or not
    const isTaskExists = await this.taskRepository.findOneBy({ title: body.title, userId: loggedInUserId, isActive: true })
    if (isTaskExists) {
      throw new CustomHttpException(
        await this.i18n.translate('task.alreadyExists'),
        HttpStatus.CONFLICT,
        'CONFLICT'
      );
    }

    const data = {
      ...body,
      userId: loggedInUserId,
      status: Status.PENDING
    }

    // Create task
    await this.taskRepository.createTask(data)

    return this.responseService.formatCreated(null, await this.i18n.translate('task.created'));
  }

  // Get all tasks by logged in user
  async getAllTasks(listTaskDto: ListTaskDto, loggedInUserId: number): Promise<TaskListResponse> {
    const { limit = 0, page = 1, search } = listTaskDto;
    const start = (page - 1) * limit;

    // get tasks query
    const query = this.taskRepository
      .createQueryBuilder('t')
      .select([
        't.id',
        't.title',
        't.description',
        't.status',
        't.isActive',
        't.createdAt',
      ])
      .where('t.isActive = :isActive AND t.userId = :userId', { isActive: true, userId: loggedInUserId });

    // search
    if (search) {
      query.andWhere('(t.title like :search OR t.description like :search)', {
        search: `%${search}%`,
      });
    }

    // pagination
    if (limit > 0) query.skip(start).take(limit);

    // get tasks data
    const [data, total] = await query.orderBy('t.id', 'DESC').getManyAndCount();

    return this.responseService.formatPaginated(
      data,
      total,
      page,
      limit,
      await this.i18n.translate('task.listSuccess'));
  }

  // Get task by id by logged in user
  async getTaskById(taskId: number, loggedInUserId: number): Promise<TaskResponse> {
    // Check if tasks exists or not
    const isTaskExists = await this.taskRepository.findOneBy({ id: taskId, userId: loggedInUserId, isActive: true })
    if (!isTaskExists) {
      throw new CustomHttpException(
        await this.i18n.translate('task.notFound'),
        HttpStatus.NOT_FOUND,
        'NOT_FOUND'
      );
    }

    const result: TaskResponseDto = {
      id: isTaskExists.id,
      title: isTaskExists.title,
      description: isTaskExists.description,
      status: isTaskExists.status,
      isActive: isTaskExists.isActive,
      createdAt: isTaskExists.createdAt
    }

    return this.responseService.formatSuccess(result, await this.i18n.translate('task.listSuccess'));
  }

  // Get all tasks
  async getUserTask({ page = 1, limit = 10, search }: ListTaskDto, userId: number): Promise<TaskListResponse> {
    const start = (page - 1) * limit;

    const query = this.taskRepository.createQueryBuilder('t')
      .select([
        't.id',
        't.title',
        't.description',
        't.status',
        't.isActive',
        't.createdAt'
      ])
      .where('t.isActive = :isActive AND t.userId = :userId', { isActive: true, userId })

    if (search) {
      query.andWhere('t.title LIKE :title OR t.description LIKE :description', { title: `%${search}%`, description: `%${search}%` })
    }

    if (limit > 0) query.skip(start).take(limit)

    const [data, total] = await query.orderBy('id', 'DESC').getManyAndCount();

    return this.responseService.formatPaginated(data, total, page, limit, await this.i18n.translate('task.listSuccess'));
  }

  // Update task by id by logged in user
  async updateTaskById(taskId: number, body: UpdateTaskDto, loggedInUserId: number): Promise<BaseResponseDto<null>> {
    // Check if tasks exists or not
    const isTaskExists = await this.taskRepository.findOneBy({ id: taskId, userId: loggedInUserId, isActive: true })
    if (!isTaskExists) {
      throw new CustomHttpException(
        await this.i18n.translate('task.notFound'),
        HttpStatus.NOT_FOUND,
        'NOT_FOUND'
      );
    }

    // Check if same task tile is exists for same logged in user
    if (body.title) {
      const isTaskTitleExists = await this.taskRepository.findOne({ where: { title: body.title, userId: loggedInUserId, isActive: true, id: Not(taskId) } },)
      if (isTaskTitleExists) {
        throw new CustomHttpException(
          await this.i18n.translate('task.alreadyExists'),
          HttpStatus.CONFLICT,
          'CONFLICT'
        );
      }
    }

    await this.taskRepository.update(taskId, body)

    return this.responseService.formatSuccess(null, await this.i18n.translate('task.updated'));
  }

  // Delete task by id by logged in user
  async deleteTaskByLoggedInUserId(taskId: number, loggedInUserId: number): Promise<BaseResponseDto<null>> {
    // Check if tasks exists or not
    const isTaskExists = await this.taskRepository.findOneBy({ id: taskId, userId: loggedInUserId, isActive: true })
    if (!isTaskExists) {
      throw new CustomHttpException(
        await this.i18n.translate('task.notFound'),
        HttpStatus.NOT_FOUND,
        'NOT_FOUND'
      );
    }

    await this.taskRepository.softDelete(taskId)

    return this.responseService.formatSuccess(null, await this.i18n.translate('task.deleted'));
  }

  // Delete task by admin
  async deleteTaskByAdmin(taskId: number): Promise<BaseResponseDto<null>> {
    // Check if tasks exists or not
    const isTaskExists = await this.taskRepository.findOneBy({ id: taskId, isActive: true })
    if (!isTaskExists) {
      throw new CustomHttpException(
        await this.i18n.translate('task.notFound'),
        HttpStatus.NOT_FOUND,
        'NOT_FOUND'
      );
    }

    await this.taskRepository.softDelete(taskId)

    return this.responseService.formatSuccess(null, await this.i18n.translate('task.deleted'));
  }

}
