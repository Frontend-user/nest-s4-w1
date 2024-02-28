import { Blog, BlogDocumentType } from '../domain/blogs-schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async getBlogById(id: string): Promise<BlogDocumentType | null> {
    return await this.blogModel.findOne({ _id: new Types.ObjectId(id) });
  }

  async getBlogs(): Promise<Blog[]> {
    return await this.blogModel.find().exec();
  }
}
