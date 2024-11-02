import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Tag extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, default: '#000000' })
  color: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
