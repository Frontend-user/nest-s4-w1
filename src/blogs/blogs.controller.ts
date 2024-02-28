import { Body, Controller, Get, Post } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import {
  BlogInputCreateModel,
  BlogViewModel,
  WithId,
} from './types/blogs.types';
import { BlogsMongoDataMapper } from './domain/blogs.mongo.dm';
import { BlogDocumentType } from './domain/blogs-schema';

@Controller('blogs')
export class BlogsController {
  constructor(protected blogsService: BlogsService) {}

  @Get()
  async getBlogs() {
    const blogs = await this.blogsService.getBlogs();
    const changeBlogs = blogs.map((b: BlogDocumentType) =>
      BlogsMongoDataMapper.toView(b),
    );
    return changeBlogs;
  }

  @Post()
  async createBlog(
    @Body() body: BlogInputCreateModel,
  ): Promise<WithId<BlogViewModel> | false> {
    const blog: BlogDocumentType | false =
      await this.blogsService.createBlog(body);
    return blog ? BlogsMongoDataMapper.toView(blog) : false;
  }

  //
  // @Post()
  // async s(@Body() dto:{id:number}) {
  //   return dto;
  // }
}
