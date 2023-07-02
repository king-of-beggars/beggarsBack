import { Request } from 'express';
import User from '../users/user.entity';

interface RequestUser extends Request {
  user: User;
}

export default RequestUser;