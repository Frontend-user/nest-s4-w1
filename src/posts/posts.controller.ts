import { Controller, Get, Param } from '@nestjs/common';
import { PostsService } from './application/posts.service';
import { PostsRepository } from './repositories/posts.repository';
import { PostsQueryRepository } from './repositories/posts.query-repository';
import { BlogViewModel } from '../blogs/types/blogs.types';
import { BlogDocumentType } from '../blogs/domain/blogs-schema';
import { BlogsMongoDataMapper } from '../blogs/domain/blogs.mongo.dm';
import { PostDocumentType } from './domain/posts-schema';
import { PostViewModel } from './types/post.types';
import { PostsMongoDataMapper } from './domain/posts.mongo.dm';

@Controller('/posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected postsQueryRepository: PostsQueryRepository,
    protected postsRepository: PostsRepository,
  ) {}

  @Get()
  async getPosts(): Promise<PostViewModel[] | false> {
    const posts: PostDocumentType[] | null =
      await this.postsQueryRepository.getPosts();
    if (posts) {
      const changePosts: PostViewModel[] = posts.map((p) =>
        PostsMongoDataMapper.toView(p),
      );
      return changePosts;
    }
    return false;
  }

  @Get('/:id')
  async getPostById(@Param() id: string): Promise<PostViewModel | false> {
    const post: PostDocumentType | null =
      await this.postsQueryRepository.getPostById(id);
    if (post) {
      const changePost: PostViewModel = PostsMongoDataMapper.toView(post);
      return changePost;
    }
    return false;
  }
}
