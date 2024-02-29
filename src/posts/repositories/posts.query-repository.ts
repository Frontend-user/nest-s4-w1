import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Post, PostDocumentType } from '../domain/posts-schema';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async getPostById(id: string): Promise<PostDocumentType | null> {
    return await this.postModel.findOne({ _id: new Types.ObjectId(id) });
  }

  async getPosts(): Promise<PostDocumentType[] | null> {
    return await this.postModel.find().exec();
  }

  async getPostsByBlogId(id): Promise<PostDocumentType[] | null> {
    return await this.postModel.find({ blogId: new Types.ObjectId(id) }).lean();
  }
}
