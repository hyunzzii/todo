import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Todo } from './schemas/todos.schema';
import { CreateTodoRequest } from './dto/request/create-todo.request';
import { CustomException } from '../common/error/custom-exception';
import { ErrorCode } from '../common/error/error-codes.enum';
import { UpdateTodoRequest } from './dto/request/update-todo.request';
import { UpdateRepeatTodoRequest } from './dto/request/update-repeat-todo.request';
import { CompletionRateResponse } from './dto/response/completion-rate.response';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  async createTodo(request: CreateTodoRequest, userId: Types.ObjectId) {
    if (request.repeat === 'none') {
      return this.createSingleTodo(request, userId);
    }
    if (request.endRepeatDate === null) {
      throw new CustomException(ErrorCode.END_REPEAT_NECESSARY);
    }
    return this.createRepeatTodos(request, userId);
  }

  async createSingleTodo(
    request: CreateTodoRequest,
    userId: Types.ObjectId,
  ): Promise<void> {
    await new this.todoModel({
      ...request.createPartialTodo(),
      date: new Date(request.date),
      user: userId,
      createdAt: Date.now(),
    }).save();
  }

  async createRepeatTodos(
    request: CreateTodoRequest,
    userId: Types.ObjectId,
  ): Promise<void> {
    const repeatGroupId = new Types.ObjectId();
    const current = new Date(request.date);
    const endDate = new Date(request.endRepeatDate);
    while (current <= endDate) {
      await new this.todoModel({
        ...request.createPartialTodo(),
        date: current,
        user: userId,
        createdAt: Date.now(),
        repeatGroupId,
      }).save();
      current.setDate(this.calculateNextDate(current, request.repeat));
    }
  }

  private calculateNextDate(current: Date, repeat: string) {
    if (repeat === 'daily') {
      return current.getDate() + 1;
    }
    if (repeat === 'weekly') {
      return current.getDate() + 7;
    }
    if (repeat === 'monthly') {
      return current.getMonth() + 1;
    }
    return null;
  }

  async getTodosByDate(
    startDate: Date,
    endDate: Date,
    userId: Types.ObjectId,
  ): Promise<Todo[]> {
    return this.todoModel
      .find({
        user: userId,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ date: 1 })
      .exec();
  }

  async getTodosByTag(
    startDate: Date,
    endDate: Date,
    tagId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Todo[]> {
    return this.todoModel
      .find({
        user: userId,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
        tag: tagId,
      })
      .sort({ date: 1 })
      .exec();
  }

  async getCompletionRateByDate(
    startDate: Date,
    endDate: Date,
    userId: Types.ObjectId,
  ): Promise<CompletionRateResponse[]> {
    const results = await this.todoModel
      .aggregate([
        {
          $match: {
            user: userId,
            date: { $gte: startDate, $lte: endDate },
            status: { $ne: 'before' },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            total: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ['$status', 'complete'] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            _id: 1,
            completionRate: {
              $cond: [
                { $gt: ['$total', 0] },
                { $multiply: [{ $divide: ['$completed', '$total'] }, 100] },
                null,
              ],
            },
          },
        },
      ])
      .exec();

    return results.map(
      (item) => new CompletionRateResponse(item._id, item.completionRate),
    );
  }

  async updateSingleTodo(
    id: Types.ObjectId,
    request: UpdateTodoRequest,
    userId: Types.ObjectId,
  ): Promise<void> {
    const todo = await this.verifyOwner(id, userId);
    await this.todoModel.findByIdAndUpdate(
      todo._id,
      {
        ...request.createPartialTodo(),
      },
      { runValidators: true },
    );
  }

  async patchStatus(
    id: Types.ObjectId,
    status: 'complete' | 'fail' | 'before',
    userId: Types.ObjectId,
  ): Promise<void> {
    const todo = await this.verifyOwner(id, userId);
    await this.todoModel.findByIdAndUpdate(
      todo._id,
      {
        status,
      },
      { runValidators: true },
    );
  }

  async updateRepeatTodos(
    id: Types.ObjectId,
    request: UpdateRepeatTodoRequest,
    userId: Types.ObjectId,
  ): Promise<void> {
    const todo = await this.verifyOwner(id, userId);
    await this.todoModel.updateMany(
      { repeatGroupId: todo.repeatGroupId },
      { $set: request.createPartialTodo() },
      { runValidators: true },
    );
  }

  async deleteSingleTodo(
    id: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    const userObjectId = new Types.ObjectId(userId);
    const todoObjectId = new Types.ObjectId(id);
    const todo = await this.verifyOwner(todoObjectId, userObjectId);
    await todo.deleteOne();
  }

  async deleteIncompleteTodos(
    date: Date,
    userId: Types.ObjectId,
  ): Promise<void> {
    await this.todoModel.deleteMany({
      date: date,
      user: userId,
      status: 'before',
    });
  }

  async deleteAllRepeatTodos(
    id: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    const userObjectId = new Types.ObjectId(userId);
    const todoObjectId = new Types.ObjectId(id);
    const todo = await this.verifyOwner(todoObjectId, userObjectId);
    await this.todoModel.deleteMany({ repeatGroupId: todo.repeatGroupId });
  }

  async deleteAfterRepeatTodos(
    id: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    const userObjectId = new Types.ObjectId(userId);
    const todoObjectId = new Types.ObjectId(id);
    const todo = await this.verifyOwner(todoObjectId, userObjectId);
    await this.todoModel.deleteMany({
      repeatGroupId: todo.repeatGroupId,
      date: { $gte: todo.date },
    });
  }

  private async verifyOwner(
    _id: Types.ObjectId,
    user: Types.ObjectId,
  ): Promise<Todo> {
    const todo = await this.getById(_id);
    if (todo.user.equals(user)) {
      return todo;
    }
    throw new CustomException(ErrorCode.UNAUTHORIZED_ACCESS);
  }

  async getById(_id: Types.ObjectId): Promise<Todo> {
    const todo = await this.todoModel.findById(_id).exec();
    if (!todo) {
      throw new CustomException(ErrorCode.NOT_FOUND_TODO);
    }
    return todo;
  }
}
