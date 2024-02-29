import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Post, PostDocumentType } from '../domain/posts-schema';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {
  }

  async getPostById(id: string): Promise<PostDocumentType | null> {
    return await this.postModel.findOne({ _id: new Types.ObjectId(id) });
  }

  async getPosts(): Promise<PostDocumentType[] | null> {
    return await this.postModel.find().exec();
  }

  async getPostsByBlogId(id, searchNameTerm?: string, sortBy?: string, sortDirection?: string, skip: number = 0, limit: number = 10): Promise<any> {
    debugger;
    console.log(sortBy);
    let sb = sortBy ?? 'createdAt';
    console.log(sb);
    let sd = sortDirection ?? 'desc';

    let query = this.postModel.find({ blogId: id });
    let totalCount = this.postModel.find({ blogId: id });
    if (searchNameTerm) {
      const newRegexp = new RegExp(searchNameTerm, 'i');
      query.where('name').regex(newRegexp);
      totalCount.where('name').regex(newRegexp);
    }
    let sort = {};
    sort[sb] = sd;

    let posts = await query.sort(sort).skip(skip).limit(limit).lean();
    if (posts.length > 0) {
      const allPosts = await totalCount.countDocuments();

      return { totalCount: allPosts, posts: posts };
    } else return [];
    // }
    // let s = await this.blogModel.find({});
    // return s;
    // return await this.postModel.find({ blogId: id }).exec();
  }

}
