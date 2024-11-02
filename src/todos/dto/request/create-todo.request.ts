import { Types } from 'mongoose';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Todo } from '../../schemas/todos.schema';

export class CreateTodoRequest {
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

  @IsString()
  @IsNotEmpty()
  tag: string;

  @IsString()
  @IsIn(['daily', 'weekly', 'monthly', 'none'])
  repeat: 'daily' | 'weekly' | 'monthly' | 'none';

  @ValidateIf((obj) => obj.repeat !== 'none')
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'endRepeatDate must be in the format YYYY-MM-DD',
  })
  endRepeatDate?: string;

  createPartialTodo(): Partial<Todo> {
    const partialTodo: Partial<Todo> = {};

    partialTodo.title = this.title;
    partialTodo.description = this.description;
    partialTodo.tag = new Types.ObjectId(this.tag);
    partialTodo.repeat = this.repeat;

    return partialTodo;
  }
}
