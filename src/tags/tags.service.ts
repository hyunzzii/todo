import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tag } from './schema/tags.schema';
import { UpdateTagRequest } from './dto/update-tag.request';
import { CustomException } from '../common/error/custom-exception';
import { ErrorCode } from '../common/error/error-codes.enum';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private readonly tagModel: Model<Tag>) {}

  async createTag(request: UpdateTagRequest, userId: Types.ObjectId): Promise<void> {
    const newTag = new this.tagModel({
      name: request.name,
      color: request.color,
      user: userId,
    });
    await newTag.save();
  }

  async updateTag(
    request: UpdateTagRequest,
    tagId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<void> {
    await this.verifyOwner(tagId, userId);
    await this.tagModel.findByIdAndUpdate({ _id: tagId }, request).exec();
  }

  async deleteTag(tagId: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
    await this.verifyOwner(tagId, userId);
    await this.tagModel.findByIdAndDelete({ _id: tagId }).exec();
  }

  async getAllTags(userId: Types.ObjectId): Promise<Tag[]> {
    return this.tagModel.find({ user: userId }).exec();
  }

  private async verifyOwner(
    tagId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Tag> {
    const tag = await this.getTagById(tagId);
    if (tag.user.equals(userId) == false) {
      throw new CustomException(ErrorCode.UNAUTHORIZED_ACCESS);
    }
    return tag;
  }

  private async getTagById(id: Types.ObjectId): Promise<Tag | null> {
    const tag = await this.tagModel.findOne({ _id: id }).exec();
    if (!tag) {
      throw new CustomException(ErrorCode.NOT_FOUND_TAG);
    }
    return tag;
  }
}
