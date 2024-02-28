import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import {
  BlogInputCreateModel,
  BlogViewModel,
  WithId,
} from './types/blogs.types';
import { BlogsMongoDataMapper } from './domain/blogs.mongo.dm';
import { BlogDocumentType } from './domain/blogs-schema';

@Controller()
export class BlogsController {
  constructor(protected blogsService: BlogsService) {}

  @Delete('/testing/all-data')
  async deleteAllData(@Res() res) {
    const a = await this.blogsService.deleteAllData();
    res.status(204).send();
  }

  @Get('/blogs')
  async getBlogs() {
    const blogs = await this.blogsService.getBlogs();
    const changeBlogs = blogs.map((b: BlogDocumentType) =>
      BlogsMongoDataMapper.toView(b),
    );
    return changeBlogs;
  }

  @Get('/blogs/:id')
  async getBlogById(@Param() id: string): Promise<BlogViewModel | false> {
    const blog: BlogDocumentType | null =
      await this.blogsService.getBlogById(id);
    if (blog) {
      const changeBlog: BlogViewModel = BlogsMongoDataMapper.toView(blog);
      return changeBlog;
    }
    return false;
  }

  @Post('/blogs')
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
