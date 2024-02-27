import { BlogsRepository } from './blogs.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}
  async createBlog() {
    return await this.blogsRepository.createBlog();
  }
  async getBlogs() {
    return await this.blogsRepository.getBlogs();
  }
}
