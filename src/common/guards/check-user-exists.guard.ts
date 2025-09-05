import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from 'src/api/user/user.repository';
import { RequestUser } from '../dto/request-user.dto';

@Injectable()
export class CheckUserExistGuard implements CanActivate {
  constructor(private readonly userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestUser>();

    if (!request.user) {
      throw new NotFoundException('User not found');
    }

    const isUserExist = await this.userRepository.findOneBy({
      id: request.user.sub,
      isActive: true,
    });

    if (!isUserExist) {
      throw new NotFoundException('User not found');
    }

    return true;
  }
}
