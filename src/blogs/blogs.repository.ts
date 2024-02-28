import { Blog, BlogDocumentType } from './domain/blogs-schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async createBlog(blogEntity?: Blog): Promise<BlogDocumentType | false> {
    const createdBlog = await new this.blogModel(blogEntity);
    const getCreatedBlog = await createdBlog.save();
    const blogToReturn: BlogDocumentType | null = await this.blogModel.findOne({
      _id: getCreatedBlog._id,
    });
    return blogToReturn ? blogToReturn : false;
  }

  async getBlogs(): Promise<Blog[]> {
    return await this.blogModel.find().exec();
  }
}
