import { Blog, BlogDocumentType } from '../domain/blogs-schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async getBlogById(id: string): Promise<BlogDocumentType | null> {
    try {
      let a: any = await this.blogModel.findOne({ _id: new Types.ObjectId(id) }).lean();
      return a;
    } catch (r) {
      return null;
    }
  }

  async getBlogs(
    searchNameTerm?: string,
    sortBy?: string,
    sortDirection?: string,
    skip: number = 0,
    limit: number = 10,
  ): Promise<any> {
    console.log(sortBy);
    const sb = sortBy ?? 'createdAt';
    console.log(sb);
    const sd = sortDirection ?? 'desc';

    const query = this.blogModel.find();
    const totalCount = this.blogModel.find();
    if (searchNameTerm) {
      const newRegexp = new RegExp(searchNameTerm, 'i');
      query.where('name').regex(newRegexp);
      totalCount.where('name').regex(newRegexp);
    }
    const sort = {};
    sort[sb] = sd;

    const blogs = await query.sort(sort).skip(skip).limit(limit).lean();
    if (blogs.length > 0) {
      const allBlogs = await totalCount.countDocuments();

      return { totalCount: allBlogs, blogs: blogs };
    } else return [];
    // }
    // let s = await this.blogModel.find({});
    // return s;
  }
}
