import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { User } from '../domain/users-schema';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUsers(
    searchLoginTerm?: string,
    searchEmailTerm?: string,
    sortBy?: string,
    sortDirection?: string,
    skip: number = 0,
    limit: number = 10,
  ): Promise<any> {
    const sb = sortBy ?? 'accountData.createdAt';
    console.log(sb);
    const sd = sortDirection ?? 'desc';

    const query = this.userModel.find();
    const totalCount = this.userModel.find();
    if (searchLoginTerm || searchEmailTerm) {
      if (searchEmailTerm) {
        const newRegexp = new RegExp(searchEmailTerm, 'i');
        query.where(`accountData.email`).regex(newRegexp);
        totalCount.where(`accountData.email`).regex(newRegexp);
      }

      if (searchLoginTerm) {
        const newRegexp = new RegExp(searchLoginTerm, 'i');
        query.where(`accountData.login`).regex(newRegexp);
        totalCount.where(`accountData.login`).regex(newRegexp);
      }
    }
    const sort = {};
    sort[sb] = sd;

    const users = await query.sort(sort).skip(skip).limit(limit).lean();
    if (users.length > 0) {
      const allUsers = await totalCount.countDocuments();

      return { totalCount: allUsers, users: users };
    } else return [];
  }
}