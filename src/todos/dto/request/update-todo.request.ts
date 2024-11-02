import { Todo } from '../../schemas/todos.schema';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateTodoRequest {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'endRepeatDate must be in the format YYYY-MM-DD',
  })
  date: string;

  createPartialTodo(): Partial<Todo> {
    const partialTodo: Partial<Todo> = {};

    partialTodo.title = this.title;
    partialTodo.description = this.description;
    partialTodo.date = new Date(this.date);
    return partialTodo;
  }
}
