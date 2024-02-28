import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Post, PostDocumentType } from '../domain/posts-schema';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async deleteAllData() {
    await this.postModel.deleteMany({});
    return true;
  }

  async createPost(postEntity?: Post): Promise<PostDocumentType | false> {
    const createdPost = new this.postModel(postEntity);
    const getCreatedPost = await createdPost.save();
    const postToReturn: PostDocumentType | null = await this.postModel.findOne({
      _id: getCreatedPost._id,
    });
    return postToReturn ? postToReturn : false;
  }
}
