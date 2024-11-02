import { Todo } from '../../schemas/todos.schema';

export class TodoResponse {
  _id: string;
  title: string;
  description: string;
  status: 'complete' | 'fail' | 'before';
  repeat: 'daily' | 'weekly' | 'monthly' | 'none';
  tag: string;

  constructor(todo: Todo) {
    const { _id, title, description, status, repeat, tag } = todo;
    this._id = _id.toString();
    this.title = title;
    this.description = description;
    this.status = status;
    this.repeat = repeat;
    this.tag = tag.toString();
  }
}
