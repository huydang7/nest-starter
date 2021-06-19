import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as crypto from 'crypto';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, unique: true, index: true })
  email: string;

  @Prop({
    type: String,
    set: (value: any) => crypto.createHmac('sha256', value).digest('hex'),
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toJSON = function () {
  const obj: any = this.toObject();
  delete obj.password;
  return obj;
};
