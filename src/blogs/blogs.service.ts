import { BlogsRepository } from './blogs.repository';
import { Injectable } from '@nestjs/common';
import { BlogInputCreateModel } from './types/blogs.types';
import { Blog, BlogDocumentType } from './domain/blogs-schema';

@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}

  async deleteAllData() {
    return await this.blogsRepository.deleteAllData();
  }

  async createBlog(
    blog: BlogInputCreateModel,
  ): Promise<BlogDocumentType | false> {
    const blogEntity: Blog = {
      ...blog,
      isMembership: false,
      createdAt: new Date(),
    };
    return await this.blogsRepository.createBlog(blogEntity);
  }

  async getBlogs() {
    return await this.blogsRepository.getBlogs();
  }
}
