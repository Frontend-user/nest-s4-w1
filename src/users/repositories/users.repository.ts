import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { User, UserDocumentType } from '../domain/users-schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user: User): Promise<UserDocumentType | false> {
    const response = await new this.userModel(user);
    return response ? response : false;
  }

  async deleteUser(id: string) {
    const response = await this.userModel.deleteOne({ _id: new Types.ObjectId(id) });
    return !!response.deletedCount;
  }
}
