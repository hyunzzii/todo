import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Todo extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({
    type: String,
    enum: ['complete', 'fail', 'before'],
    default: 'before',
  })
  status: 'complete' | 'fail' | 'before';

  @Prop({ type: Types.ObjectId, ref: 'Tag' })
  tag: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'none'],
    default: 'none',
  })
  repeat: 'daily' | 'weekly' | 'monthly' | 'none';

  @Prop({ type: Types.ObjectId, default: null })
  repeatGroupId?: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
