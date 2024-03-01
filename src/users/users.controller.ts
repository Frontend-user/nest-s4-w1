import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { UsersService } from './application/./users.service';
import { UsersRepository } from './repositories/users.repository';
import { UsersQueryRepository } from './repositories/users.query-repository';
import { UserCreateModel, UserDocumentType } from './domain/users-schema';
import { BlogsQueryRepository } from '../blogs/repositories/blogs.query-repository';
import { HTTP_STATUSES } from '../_common/constants';
import { UsersMongoDataMapper } from './domain/users.mongo.dm';
import { blogsPaginate } from '../_common/paginate';
@Controller('/users')
export class UsersController {
  constructor(
    protected usersService: UsersService,
    protected usersQueryRepository: UsersQueryRepository,
    protected usersRepository: UsersRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsRepository: UsersRepository,
  ) {}

  @Get()
  async getUsers(
    @Res() res,
    @Query('searchLoginTerm') searchLoginTerm?: string,
    @Query('searchEmailTerm') searchEmailTerm?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: string,
    @Query('pageNumber') pageNumber?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    try {
      console.log('1');
      const { skip, limit, newPageNumber, newPageSize } = blogsPaginate.getPagination(
        pageNumber,
        pageSize,
      );
      console.log('11');
      const { totalCount, users } = await this.usersQueryRepository.getUsers(
        searchLoginTerm,
        searchEmailTerm,
        sortBy,
        sortDirection,
        skip,
        limit,
      );
      console.log(users, ' users');
      let changeUsers;
      try {
        changeUsers = users.map((b: UserDocumentType) => UsersMongoDataMapper.toView(b));
      } catch (e) {
        res.sendStatus(400);
        return;
      }
      const pagesCount = Math.ceil(totalCount / newPageSize);
      console.log('1');

      const response = {
        pagesCount: pagesCount,
        page: +newPageNumber,
        pageSize: +newPageSize,
        totalCount: totalCount,
        items: changeUsers,
      };
      res.send(response);
      // res.status(HTTP_STATUSES.OK_200).send(blogs);
    } catch (error) {
      console.error('Ошибка при получении данных из коллекции:', error);
      res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
    }
  }

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

  @Delete('/:id')
  async deleteUser(@Res() res, @Param('id') id: string) {
    try {
      const response: any = await this.usersService.deleteUser(id);
      res.send(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  }
}
