import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { Types } from 'mongoose';
import { WithId } from 'mongodb';

export type BlogDocumentType = HydratedDocument<Blog>;

export type BlogAccountDBMethodsType = {
  canBeConfirmed: () => boolean;
};

export type BlogModelType = Model<Blog, {}, BlogAccountDBMethodsType>;

// export type BlogModelType = Model<Blog, {}, BlogAccountDBMethodsType>
@Schema()
export class Blog {
  // @Prop({ required: false })
  // _id?: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  websiteUrl: string;

  @Prop()
  createdAt: Date;

  @Prop()
  isMembership: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
// BlogSchema.methods = {
//   changeToViewFormat: Blog.prototype.changeToViewFormat,
// };
