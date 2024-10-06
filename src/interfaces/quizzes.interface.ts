import { ObjectId } from 'mongoose';

export interface Quizzes {
  _id: ObjectId;
  title: string;
  description: string;
  questions: Array<ObjectId>;
}
