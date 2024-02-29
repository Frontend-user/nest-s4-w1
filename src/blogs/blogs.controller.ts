import { Body, Controller, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { BlogsService } from './application/blogs.service';
import { BlogInputCreateModel, BlogViewModel, WithId } from './types/blogs.types';
import { BlogsMongoDataMapper } from './domain/blogs.mongo.dm';
import { BlogDocumentType } from './domain/blogs-schema';
import { PostInputCreateModel, PostViewModel } from '../posts/types/post.types';
import { PostDocumentType } from '../posts/domain/posts-schema';
import { PostsService } from '../posts/application/posts.service';
import { BlogsQueryRepository } from './repositories/blogs.query-repository';
import { blogsPaginate } from '../_common/paginate';
import { PostsQueryRepository } from '../posts/repositories/posts.query-repository';
import { PostsMongoDataMapper } from '../posts/domain/posts.mongo.dm';
import { HTTP_STATUSES } from '../_common/constants';

@Controller('/blogs')
export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected postsService: PostsService,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getBlogs(
    @Query('searchNameTerm') searchNameTerm?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: string,
    @Query('pageNumber') pageNumber?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const { skip, limit, newPageNumber, newPageSize } = blogsPaginate.getPagination(
      pageNumber,
      pageSize,
    );
    const { totalCount, blogs } = await this.blogsQueryRepository.getBlogs(
      searchNameTerm,
      sortBy,
      sortDirection,
      skip,
      limit,
    );
    const changeBlogs = blogs.map((b: BlogDocumentType) => BlogsMongoDataMapper.toView(b));
    let pagesCount = Math.ceil(totalCount / newPageSize);

    const response = {
      pagesCount: pagesCount,
      page: +newPageNumber,
      pageSize: +newPageSize,
      totalCount: totalCount,
      items: changeBlogs,
    };

    return response;
  }

  @Get('/:id')
  async getBlogById(@Param('id') id: string): Promise<BlogViewModel | false> {
    const blog: BlogDocumentType | null = await this.blogsQueryRepository.getBlogById(id);
    if (blog) {
      const changeBlog: BlogViewModel = BlogsMongoDataMapper.toView(blog);
      return changeBlog;
    }
    return false;
  }

  @Get('/:id/posts')
  async getPostByBlogId(
    @Param('id') id: string,
    @Res() res,
    @Query('searchNameTerm') searchNameTerm?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: string,
    @Query('pageNumber') pageNumber?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    debugger;
    // const posts: PostViewModel[] | false = await this.postsService.getPostsByBlogId(id);
    if (!id) {
      res.sendStatus(404);
      return;
    }
    const { skip, limit, newPageNumber, newPageSize } = blogsPaginate.getPagination(
      pageNumber,
      pageSize,
    );
    const result = await this.postsQueryRepository.getPostsByBlogId(
      id,
      searchNameTerm,
      sortBy,
      sortDirection,
      skip,
      limit,
    );
    if (!result) {
      res.sendStatus(404);
      return;
    }
    let { totalCount, posts } = result;
    const changeBlogs = posts.map((b: PostDocumentType) => PostsMongoDataMapper.toView(b));
    let pagesCount = Math.ceil(totalCount / newPageSize);

    const response = {
      pagesCount: pagesCount,
      page: +newPageNumber,
      pageSize: +newPageSize,
      totalCount: totalCount,
      items: changeBlogs,
    };

    return res.send(response);
    // return posts ? res.send(posts) : res.sendStatus(404);
  }

  @Post()
  async createBlog(@Body() body: BlogInputCreateModel): Promise<WithId<BlogViewModel> | false> {
    const blog: BlogDocumentType | false = await this.blogsService.createBlog(body);
    return blog ? BlogsMongoDataMapper.toView(blog) : false;
  }

  @Post('/:id/posts')
  async createPostByBlogId(
    @Body() body: PostInputCreateModel,
    @Param('id') id: string,
    @Res() res,
  ): Promise<WithId<PostViewModel> | undefined> {
    const blog = await this.blogsService.getBlogById(id);
    if (blog) {
      body.blogId = String(blog._id);
      const post: WithId<PostViewModel> | false = await this.postsService.createPost(
        body,
        blog.name,
      );
      return post ? res.send(post) : res.sendStatus(404);
    }
    res.sendStatus(404);
  }

  //
  // @Post()
  // async s(@Body() dto:{id:number}) {
  //   return dto;
  // }

  @Put('/:id')
  async updateBlog(
    @Res() res,
    @Body() body:BlogInputCreateModel,
    @Param('id') id: string,
  ) {
    const response: boolean = await this.blogsService.updateBlog(id, body);
    res.sendStatus(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
  }
}
