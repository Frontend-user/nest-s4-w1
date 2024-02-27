import { Controller, Get } from '@nestjs/common';
import { BlogsService } from './blogs.service';

@Controller()
export class BlogsController {
  constructor(protected blogsService: BlogsService) {}
  @Get('blogs')
  getBlogs() {
    return this.blogsService.getBlogs();
  }
}
