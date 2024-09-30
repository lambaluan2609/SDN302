import { ObjectId } from 'mongoose';

export interface Questions {
  _id: ObjectId;
  quizId: ObjectId;
  text: string;
  options: Array<string>;
  correctAnswerIndex: number;
}
