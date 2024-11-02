import { Tag } from '../schema/tags.schema';

export class TagResponse {
  _id: string;
  name: string;
  color: string;

  constructor(tag: Tag) {
    this._id = tag._id.toString(); // _id를 문자열로 변환
    this.name = tag.name;
    this.color = tag.color;
  }
}
