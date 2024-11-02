import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.auth.guard';
import { CreateTodoRequest } from './dto/request/create-todo.request';
import { UpdateTodoRequest } from './dto/request/update-todo.request';
import { UpdateRepeatTodoRequest } from './dto/request/update-repeat-todo.request';
import { ListTodoResponse } from './dto/response/list-todo.response';
import { CompletionRateResponse } from './dto/response/completion-rate.response';
import { Types } from 'mongoose';
import { CustomException } from '../common/error/custom-exception';
import { ErrorCode } from '../common/error/error-codes.enum';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async createTodo(
    @Request() req,
    @Body() request: CreateTodoRequest,
  ): Promise<void> {
    const userId = req.user.userId;
    await this.todosService.createTodo(request, new Types.ObjectId(userId));
  }

  @Get()
  async getTodosByDate(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<ListTodoResponse[]> {
    const userId = req.user.userId;
    const todos = await this.todosService.getTodosByDate(
      new Date(startDate),
      new Date(endDate),
      new Types.ObjectId(userId),
    );
    return ListTodoResponse.groupByDate(todos);
  }

  @Get('tag/:tagId')
  async getTodosByTag(
    @Request() req,
    @Param('tagId') tagId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<ListTodoResponse[]> {
    const userId = req.user.userId;
    const todos = await this.todosService.getTodosByTag(
      new Date(startDate),
      new Date(endDate),
      new Types.ObjectId(tagId),
      new Types.ObjectId(userId),
    );
    return ListTodoResponse.groupByDate(todos);
  }

  @Get('completion-rate')
  async getCompletionRateByDate(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<CompletionRateResponse[]> {
    const userId = req.user.userId;
    return this.todosService.getCompletionRateByDate(
      new Date(startDate),
      new Date(endDate),
      new Types.ObjectId(userId),
    );
  }

  @Put(':todoId')
  async updateSingleTodo(
    @Request() req,
    @Param('todoId') todoId: string,
    @Body() request: UpdateTodoRequest,
  ): Promise<void> {
    const userId = req.user.userId;
    await this.todosService.updateSingleTodo(
      new Types.ObjectId(todoId),
      request,
      new Types.ObjectId(userId),
    );
  }

  @Patch(':todoId/status')
  async patchStatusTodo(
    @Request() req,
    @Param('todoId') todoId: string,
    @Query('status') status: 'complete' | 'fail' | 'before',
  ): Promise<void> {
    const allowedStatuses = ['complete', 'fail', 'before'];
    if (!allowedStatuses.includes(status)) {
      throw new CustomException(ErrorCode.INVALID_STATUS);
    }
    const userId = req.user.userId;
    await this.todosService.patchStatus(
      new Types.ObjectId(todoId),
      status,
      new Types.ObjectId(userId),
    );
  }

  @Delete('/incomplete')
  async deleteIncompleteRepeatTodos(
    @Request() req,
    @Query('date') date: string,
  ): Promise<void> {
    const userId = req.user.userId;
    await this.todosService.deleteIncompleteTodos(
      new Date(date),
      new Types.ObjectId(userId),
    );
  }

  @Put('repeat/:todoId')
  async updateRepeatTodos(
    @Request() req,
    @Param('todoId') todoId: string,
    @Body() request: UpdateRepeatTodoRequest,
  ): Promise<void> {
    const userId = req.user.userId;
    await this.todosService.updateRepeatTodos(
      new Types.ObjectId(todoId),
      request,
      new Types.ObjectId(userId),
    );
  }

  @Delete(':todoId')
  async deleteSingleTodo(
    @Request() req,
    @Param('todoId') todoId: string,
  ): Promise<void> {
    const userId = req.user.userId;
    await this.todosService.deleteSingleTodo(
      new Types.ObjectId(todoId),
      new Types.ObjectId(userId),
    );
  }

  @Delete('repeat/:todoId')
  async deleteAllRepeatTodos(
    @Request() req,
    @Param('todoId') todoId: string,
  ): Promise<void> {
    const userId = req.user.userId;
    await this.todosService.deleteAllRepeatTodos(
      new Types.ObjectId(todoId),
      new Types.ObjectId(userId),
    );
  }

  @Delete('repeat-after/:todoId')
  async deleteAfterRepeatTodos(
    @Request() req,
    @Param('todoId') todoId: string,
  ): Promise<void> {
    const userId = req.user.userId;
    await this.todosService.deleteAfterRepeatTodos(
      new Types.ObjectId(todoId),
      new Types.ObjectId(userId),
    );
  }
}
