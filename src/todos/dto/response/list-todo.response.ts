import { Todo } from '../../schemas/todos.schema';
import { TodoResponse } from './todo.response';

export class ListTodoResponse {
  date: string;
  todos: TodoResponse[];

  constructor(date: string, todos: Todo[]) {
    this.date = date;
    this.todos = todos.map((todo) => new TodoResponse(todo));
  }

  static groupByDate(todos: Todo[]): ListTodoResponse[] {
    const groupedByDate: { [key: string]: Todo[] } = {};

    todos.forEach((todo) => {
      const dateKey = todo.date.toISOString().split('T')[0];
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = [];
      }
      groupedByDate[dateKey].push(todo);
    });

    return Object.keys(groupedByDate).map(
      (date) => new ListTodoResponse(date, groupedByDate[date]),
    );
  }
}
