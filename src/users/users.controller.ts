import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { UsersService } from './application/./users.service';
import { UsersRepository } from './repositories/users.repository';
import { UsersQueryRepository } from './repositories/users.query-repository';
import { UserCreateModel, UserDocumentType } from './domain/users-schema';
import { BlogsQueryRepository } from '../blogs/repositories/blogs.query-repository';
import { HTTP_STATUSES } from '../_common/constants';
import { UsersMongoDataMapper } from "./domain/users.mongo.dm";

@Controller('/users')
export class UsersController {
  constructor(
    protected usersService: UsersService,
    protected usersQueryRepository: UsersQueryRepository,
    protected usersRepository: UsersRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsRepository: UsersRepository,
  ) {}

  // @Get()
  // async getUsers(
  //   @Res() res,
  //   @Query('sortBy') sortBy?: string,
  //   @Query('sortDirection') sortDirection?: string,
  //   @Query('pageNumber') pageNumber?: number,
  //   @Query('pageSize') pageSize?: number,
  // ) {
  //   const { skip, limit, newPageNumber, newPageSize } = blogsPaginate.getPagination(
  //     pageNumber,
  //     pageSize,
  //   );
  //   const result = await this.usersQueryRepository.getPosts(sortBy, sortDirection, skip, limit);
  //
  //   if (!result) {
  //     res.sendStatus(404);
  //     return;
  //   }
  //   const { totalCount, posts } = result;
  //   const changeBlogs = posts.map((b: PostDocumentType) => PostsMongoDataMapper.toView(b));
  //   const pagesCount = Math.ceil(totalCount / newPageSize);
  //
  //   const response = {
  //     pagesCount: pagesCount,
  //     page: +newPageNumber,
  //     pageSize: +newPageSize,
  //     totalCount: totalCount,
  //     items: changeBlogs,
  //   };
  //   return res.send(response);
  // }

  @Post()
  async createUser(@Res() res, @Body() body: UserCreateModel) {
    try {
      const isReqFromSuperAdmin = true;
      try {
        const response: UserDocumentType | false = await this.usersService.createUser(
          body,
          isReqFromSuperAdmin,
        );
        if (response) {
          //   const createdBlog: UserViewModel | false =
          //     await this.usersQueryRepository.getUserById(response);

          res.status(HTTP_STATUSES.CREATED_201).send(UsersMongoDataMapper.toView(response));
          return;
        }
      } catch (e) {
        console.log(e, 'error');
      }
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
    }
  }
}
