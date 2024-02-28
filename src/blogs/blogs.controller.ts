import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

@Controller('/blogs')
export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected postsService: PostsService,
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
      await this.blogsService.getBlogById(id);
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
    // ): Promise<WithId<BlogViewModel> | false> {
  ) {
    const blog = await this.blogsService.getBlogById(body.blogId);
    if (blog) {
      const post: PostViewModel | false = await this.postsService.createPost(
        body,
        blog.name,
      );
      return post;
    }
    return false;
    // return blog ? BlogsMongoDataMapper.toView(blog) : false;
  }

  @Get('/:id/posts')
  async getPostsByBlogId(@Param('id') id: string) {
    debugger;
    const posts: PostViewModel[] | false =
      await this.postsService.getPostsByBlogId(id);
    return posts;
  }

  //
  // @Post()
  // async s(@Body() dto:{id:number}) {
  //   return dto;
  // }
}
