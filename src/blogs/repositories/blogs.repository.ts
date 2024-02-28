import { Blog, BlogDocumentType } from '../domain/blogs-schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async deleteAllData() {
    await this.blogModel.deleteMany({});
    return true;
  }

  async createBlog(blogEntity?: Blog): Promise<BlogDocumentType | false> {
    const createdBlog = new this.blogModel(blogEntity);
    const getCreatedBlog = await createdBlog.save();
    const blogToReturn: BlogDocumentType | null = await this.blogModel.findOne({
      _id: getCreatedBlog._id,
    });
    return blogToReturn ? blogToReturn : false;
  }
}
