import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  loginId: string;

  @Prop({ required: true })
  loginPw: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
