import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { BlogsService } from './application/blogs.service';
import {
  BlogInputCreateModel,
  BlogViewModel,
  WithId,
} from './types/blogs.types';
import { BlogsMongoDataMapper } from './domain/blogs.mongo.dm';
import { BlogDocumentType } from './domain/blogs-schema';
import { PostInputCreateModel, PostViewModel } from '../posts/types/post.types';
import { PostDocumentType } from '../posts/domain/posts-schema';
import { PostsService } from '../posts/application/posts.service';
import { BlogsQueryRepository } from './repositories/blogs.query-repository';

@Controller('/blogs')
export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected postsService: PostsService,
    protected blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @Get()
  async getBlogs() {
    const blogs = await this.blogsService.getBlogs();
    const changeBlogs = blogs.map((b: BlogDocumentType) =>
      BlogsMongoDataMapper.toView(b),
    );
    return changeBlogs;
  }

  @Get('/:id')
  async getBlogById(@Param() id: string): Promise<BlogViewModel | false> {
    const blog: BlogDocumentType | null =
      await this.blogsQueryRepository.getBlogById(id);
    if (blog) {
      const changeBlog: BlogViewModel = BlogsMongoDataMapper.toView(blog);
      return changeBlog;
    }
    return false;
  }

  @Post()
  async createBlog(
    @Body() body: BlogInputCreateModel,
  ): Promise<WithId<BlogViewModel> | false> {
    const blog: BlogDocumentType | false =
      await this.blogsService.createBlog(body);
    return blog ? BlogsMongoDataMapper.toView(blog) : false;
  }

  @Post('/:id/posts')
  async createPost(
    @Body() body: PostInputCreateModel,
    @Param() id: string,
    @Res() res,
  ): Promise<WithId<PostViewModel> | undefined> {
    const blog = await this.blogsService.getBlogById(id);
    if (blog) {
      body.blogId = String(blog._id);
      const post: WithId<PostViewModel> | false =
        await this.postsService.createPost(body, blog.name);
      return post ? post : res.sendStatus(404);
    }
    res.sendStatus(404);
  }

  @Get('/:id/posts')
  async getPostsByBlogId(@Param('id') id: string, @Res() res) {
    debugger;
    const posts: PostViewModel[] | false =
      await this.postsService.getPostsByBlogId(id);
    return posts ? posts : res.sendStatus(404);
  }

  //
  // @Post()
  // async s(@Body() dto:{id:number}) {
  //   return dto;
  // }
}
