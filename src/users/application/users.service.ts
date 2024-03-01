import { UsersRepository } from '../repositories/users.repository';
import { JwtService } from '../../_common/jwt-service';
import { PostsQueryRepository } from '../../posts/repositories/posts.query-repository';
import { User, UserCreateModel, UserDocumentType } from '../domain/users-schema';
import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    protected usersRepositories: UsersRepository,
    protected jwtService: JwtService,
    protected postsQueryRepository: PostsQueryRepository,
  ) {}

  async createUser(
    user: UserCreateModel,
    isReqFromSuperAdmin: boolean,
  ): Promise<UserDocumentType | false> {
    const passwordSalt = await this.jwtService.generateSalt(10);
    const passwordHash = await this.jwtService.generateHash(user.password, passwordSalt);
    const userEmailEntity: User = {
      accountData: {
        login: user.login,
        email: user.email,
        createdAt: new Date(),
      },
      passwordSalt,
      passwordHash,
      emailConfirmation: {
        confirmationCode: 'superadmin',
        expirationDate: new Date(),
      },
      isConfirmed: isReqFromSuperAdmin,
      isCreatedFromAdmin: true,
    };
    const newUser = await this.usersRepositories.createUser(userEmailEntity);
    if (!newUser) {
      return false;
    }
    return newUser;
  }
}
