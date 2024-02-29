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

  async getBlogs(
    searchNameTerm?: string,
    sortBy?: string,
    sortDirection?: string,
  ): Promise<Blog[]> {
    debugger;
    console.log(sortBy);
    let sb = sortBy ?? 'createdAt';
    console.log(sb);
    let sd = sortDirection ?? 'desc';
    // getFindings(searchNameTerm?:string){
    //   let findQuery: QueryFindType = {}
    //   if (searchNameTerm) {
    //     findQuery["name"] = {$regex: searchNameTerm, $options: 'i'};
    //   }
    //   return findQuery
    // }
    let query = this.blogModel.find();
    if (searchNameTerm) {
      const newRegexp = new RegExp(searchNameTerm, 'i');
      query.where('name').regex(newRegexp);
    }
    let sort = {};
    sort[sb] = sd;
    let blogs = await query.sort(sort).lean();
    if (blogs.length > 0) {
      return blogs;
    } else return [];
    // }
    // let s = await this.blogModel.find({});
    // return s;
  }
}
