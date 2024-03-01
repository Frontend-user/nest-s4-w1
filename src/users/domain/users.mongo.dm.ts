import { UserDocumentType, UserViewModel } from './users-schema';
import { WithId } from '../types/users.types';

export class UsersMongoDataMapper {
  static toView(user: UserDocumentType): WithId<UserViewModel> {
    return {
      id: String(user._id),
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt,
    };
  }

  static __getUserSortingOR(searchLoginTerm?: string, searchEmailTerm?: string) {
    let findQuery: any = {};
    if (searchLoginTerm || searchEmailTerm) {
      findQuery = {
        $or: [
          { 'accountData.login': { $regex: String(searchLoginTerm), $options: 'i' } },
          { 'accountData.email': { $regex: String(searchEmailTerm), $options: 'i' } },
        ],
      };
    }
    return findQuery;
  }

  static __getUsersFindings(searchLoginTerm?: string, searchEmailTerm?: string) {
    let findQuery: any = {};
    if (searchLoginTerm || searchEmailTerm) {
      findQuery = {
        $and: [
          { 'accountData.login': { $regex: String(searchLoginTerm), $options: 'i' } },
          { 'accountData.email': { $regex: String(searchEmailTerm), $options: 'i' } },
        ],
      };
    }
    return findQuery;
  }

  static __getUserSorting(sortBy?: string, sortDirection?: any | string) {
    const sortQuery: any = { 'accountData.createdAt': -1 };
    if (sortBy) {
      delete sortQuery['accountData.createdAt'];
      sortQuery[`accountData.${sortBy}`] = sortDirection === 'asc' ? 1 : -1;
    }
    if (sortDirection && !sortBy) {
      sortQuery['accountData.createdAt'] = sortDirection === 'asc' ? 1 : -1;
    }
    return sortQuery;
  }
}
