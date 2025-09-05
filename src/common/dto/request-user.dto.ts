import { Request } from 'express';
import { UserRole } from '../../api/user/entity/user.entity';

interface User {
  sub: number;
  email: string;
  role: UserRole;
}

export interface RequestUser extends Request {
  user: User;
}
