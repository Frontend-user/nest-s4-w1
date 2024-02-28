import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { ExtendedLikesInfoType } from '../types/post.types';

export type PostDocumentType = HydratedDocument<Post>;
export type PostAccountDBMethodsType = {
  canBeConfirmed: () => boolean;
};

// export type PostModelType = Model<Post, {}, PostAccountDBMethodsType>;

// export type BlogModelType = Model<Blog, {}, BlogAccountDBMethodsType>
@Schema()
export class Post {
  @Prop()
  title: string;

  @Prop()
  shortDescription: string;

  @Prop()
  content: string;

  @Prop()
  blogId: string;

  @Prop()
  blogName: string;

  @Prop()
  createdAt: Date;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  extendedLikesInfo: ExtendedLikesInfoType;
}

export const PostSchema = SchemaFactory.createForClass(Post);
// BlogSchema.methods = {
//   changeToViewFormat: Blog.prototype.changeToViewFormat,
// };
