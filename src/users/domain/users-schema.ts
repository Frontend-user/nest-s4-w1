import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { ExtendedLikesInfoType } from '../types/users.types';

export type UserDocumentType = HydratedDocument<User>;
export type UserAccountDBMethodsType = {
  canBeConfirmed: () => boolean;
};

// export type PostModelType = Model<Post, {}, PostAccountDBMethodsType>;

// export type BlogModelType = Model<Blog, {}, BlogAccountDBMethodsType>
@Schema()
export class User {
  @Prop({ type: SchemaTypes.Mixed, required: true }) accountData: UserAccountDataModel;

  @Prop() passwordSalt: string;

  @Prop() passwordHash: string;

  @Prop({ type: SchemaTypes.Mixed, required: true }) emailConfirmation: UserEmailConfirmationModel;

  @Prop() isConfirmed: boolean;
  @Prop() isCreatedFromAdmin: boolean;
}

export type UserCreateModel = {
  login: string;
  password: string;
  email: string;
};

export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: Date;
};
type UserAccountDataModel = {
  login: string;
  email: string;
  createdAt: Date;
};
type UserEmailConfirmationModel = {
  confirmationCode: string;
  expirationDate: Date;
};

export const UserSchema = SchemaFactory.createForClass(User);
// BlogSchema.methods = {
//   changeToViewFormat: Blog.prototype.changeToViewFormat,
// };
