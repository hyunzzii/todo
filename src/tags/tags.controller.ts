import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { TagService } from './tags.service';
import { UpdateTagRequest } from './dto/update-tag.request';
import { JwtAuthGuard } from '../auth/jwt/jwt.auth.guard';
import { TagResponse } from './dto/tag.response';
import { Types } from 'mongoose';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTag(
    @Request() req,
    @Body() request: UpdateTagRequest,
  ): Promise<void> {
    const userId = req.user.userId;
    await this.tagService.createTag(request, new Types.ObjectId(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':tagId')
  async deleteTag(
    @Request() req,
    @Param('tagId') tagId: number,
  ): Promise<void> {
    const userId = req.user.userId;
    await this.tagService.deleteTag(
      new Types.ObjectId(tagId),
      new Types.ObjectId(userId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':tagId')
  async updateTag(
    @Request() req,
    @Param('tagId') tagId: number,
    @Body() request: UpdateTagRequest,
  ): Promise<void> {
    const userId = req.user.userId;
    await this.tagService.updateTag(
      request,
      new Types.ObjectId(tagId),
      new Types.ObjectId(userId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTags(@Request() req): Promise<TagResponse[]> {
    const userId = req.user.userId;
    return (await this.tagService.getAllTags(new Types.ObjectId(userId))).map(
      (tag) => new TagResponse(tag),
    );
  }
}
