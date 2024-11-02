import { Todo } from '../../schemas/todos.schema';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from "mongoose";

export class UpdateRepeatTodoRequest {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  tag: string;

  createPartialTodo(): Partial<Todo> {
    const partialTodo: Partial<Todo> = {};

    partialTodo.title = this.title;
    partialTodo.description = this.description;
    partialTodo.tag = new Types.ObjectId(this.tag);

    return partialTodo;
  }
}
