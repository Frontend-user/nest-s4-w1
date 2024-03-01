import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { PostsService } from './application/posts.service';
import { PostsRepository } from './repositories/posts.repository';
import { PostsQueryRepository } from './repositories/posts.query-repository';
import { BlogInputCreateModel, BlogViewModel } from '../blogs/types/blogs.types';
import { BlogDocumentType } from '../blogs/domain/blogs-schema';
import { BlogsMongoDataMapper } from '../blogs/domain/blogs.mongo.dm';
import { PostDocumentType } from './domain/posts-schema';
import { PostInputCreateModel, PostViewModel } from './types/post.types';
import { PostsMongoDataMapper } from './domain/posts.mongo.dm';
import { BlogsQueryRepository } from '../blogs/repositories/blogs.query-repository';
import { HTTP_STATUSES } from '../_common/constants';

@Controller('/posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected postsQueryRepository: PostsQueryRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsRepository: PostsRepository,
  ) {}

  @Get()
  async getPosts(): Promise<PostViewModel[] | false> {
    const posts: PostDocumentType[] | null = await this.postsQueryRepository.getPosts();
    if (posts) {
      const changePosts: PostViewModel[] = posts.map((p) => PostsMongoDataMapper.toView(p));
      return changePosts;
    }
    return false;
  }

  @Get('/:id')
  async getPostById(@Param() id: string): Promise<PostViewModel | false> {
    const post: PostDocumentType | null = await this.postsQueryRepository.getPostById(id);
    if (post) {
      const changePost: PostViewModel = PostsMongoDataMapper.toView(post);
      return changePost;
    }
    return false;
  }

  @Post()
  async createPost(@Res() res, @Body() body: PostInputCreateModel) {
    const getBlog: any = await this.blogsQueryRepository.getBlogById(body.blogId);
    if (getBlog) {
      const newPost: any = { ...body };
      try {
        const postId = await this.postsService.createPost(newPost, getBlog.name);
        if (postId) {
          res.status(HTTP_STATUSES.CREATED_201).send(postId);
          return;
        }
        res.sendStatus(HTTP_STATUSES.SOMETHING_WRONG_400);
        return;
      } catch (error) {
        res.sendStatus(HTTP_STATUSES.SOMETHING_WRONG_400);
      }
    }
  }

  @Put('/:id')
  async updatePost(@Res() res, @Body() body: PostInputCreateModel, @Param('id') id: string) {
    debugger;
    try {
      const response: boolean = await this.postsService.updatePost(id, body);
      res.sendStatus(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404);
      return

    } catch (e) {
      console.log(e);
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return
    }
  }
}
