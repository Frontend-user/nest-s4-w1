import { Injectable } from '@nestjs/common';
import { PostInputCreateModel, PostViewModel } from '../types/post.types';
import { Post, PostDocumentType } from '../domain/posts-schema';
import { PostsRepository } from '../repositories/posts.repository';
import { PostsQueryRepository } from '../repositories/posts.query-repository';
import { PostsMongoDataMapper } from '../domain/posts.mongo.dm';
import { BlogInputCreateModel, WithId } from "../../blogs/types/blogs.types";

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected postsQueryRepository: PostsQueryRepository,
  ) {}

  async createPost(
    post: PostInputCreateModel,
    blogName: string,
  ): Promise<WithId<PostViewModel> | false> {
    const PostEntity: Post = {
      ...post,
      blogName: blogName,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
      createdAt: new Date(),
    };

    const createdPost = await this.postsRepository.createPost(PostEntity);
    return createdPost ? PostsMongoDataMapper.toView(createdPost) : false;
  }

  async getPostById(id: string): Promise<PostDocumentType | null> {
    return await this.postsQueryRepository.getPostById(id);
  }

  // async getPostsByBlogId(id: string) {
  //   const posts: PostDocumentType[] | null = await this.postsQueryRepository.getPostsByBlogId(id);
  //   if (!posts) {
  //     return false;
  //   }
  //   let mappedPosts: PostViewModel[];
  //   if (posts.length > 0) {
  //     mappedPosts = posts.map((p) => PostsMongoDataMapper.toView(p));
  //   }
  // }
  async updatePost(id: string, post: PostInputCreateModel): Promise<boolean> {
    return await this.postsRepository.updatePost(id, post);
  }
  async getPosts() {
    return await this.postsQueryRepository.getPosts();
  }

  async deleteAllData() {
    return await this.postsRepository.deleteAllData();
  }

  async deleteBlog(id: string): Promise<boolean> {
    return await this.postsRepository.deletePost(id);
  }

}
