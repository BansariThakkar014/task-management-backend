import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseService } from 'src/common/services/response.service';
import { ListUserDto } from './dto/list-user.dto';
import { UserRepository } from './user.repository';
import { CustomHttpException } from 'src/common/exception/http-exception';
import { UserRole } from './entity/user.entity';
import { TaskRepository } from '../task/task.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository,
    private readonly taskRepository: TaskRepository,
    private readonly responseService: ResponseService
  ) { }

  // Get all users
  async getUsers(listUserDto: ListUserDto) {
    const { limit = 0, page = 1, search} = listUserDto;
    const start = (page - 1) * limit;

    // get users query
    const query = this.userRepository
      .createQueryBuilder('u')
      .select([
        'u.id',
        'u.firstName',
        'u.lastName',
        'u.email',
        'u.role',
        'u.isActive',
        'u.createdAt',
      ])
      .where('u.isActive = :isActive', { isActive: true });

    // search
    if (search) {
      query.andWhere('(u.firstName like :search OR u.lastName like :search)', {
        search: `%${search}%`,
      });
    }

    // pagination
    if (limit > 0) query.skip(start).take(limit);

    // get users data
    const [data, total] = await query.orderBy('u.id', 'DESC').getManyAndCount();

    return this.responseService.formatPaginated(
      data,
      total,
      page,
      limit,
      'Users fetched successfully.');
  }

  // Delete user by id
  async deleteUserById(userId: number) {
    // Check if user exist or not
    const isExists = await this.userRepository.findOneBy({ id: userId, isActive: true })
    if (!isExists) {
      throw new CustomHttpException(
        'User not found.',
        HttpStatus.NOT_FOUND,
        'NOT_FOUND'
      )
    }

    if(isExists.role === UserRole.ADMIN){
      throw new CustomHttpException(
        'Admin user cannot be deleted.',
        HttpStatus.FORBIDDEN,
        'FORBIDDEN'
      )
    }

    await this.userRepository.softDelete(userId)

    // Delete user's tasks
    await this.taskRepository.softDelete({ userId })

    return this.responseService.formatSuccess(null, 'User deleted successfully.')
  }
}
