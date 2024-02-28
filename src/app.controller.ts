import { Controller, Delete, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { BlogsService } from './blogs/application/blogs.service';
import { PostsService } from './posts/application/posts.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    protected blogsService: BlogsService,
    protected postsService: PostsService,
  ) {}

  @Delete('/testing/all-data')
  async deleteAllData(@Res() res) {
    await this.blogsService.deleteAllData();
    await this.postsService.deleteAllData();
    res.status(204).send();
  }
}
