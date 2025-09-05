import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { TaskRepository } from '../task/task.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, TaskRepository, JwtService],
})
export class UserModule {}
