import { Blog } from './blogs-schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async createBlog(createBlogDto?: any): Promise<Blog> {
    const createdBlog = await new this.blogModel({ name: 'sss' });
    return await createdBlog.save();
  }

  async getBlogs(): Promise<Blog[]> {
    return await this.blogModel.find().exec();
  }
}
