import { model, Schema, Document } from 'mongoose';
import { Quizzes } from '@/interfaces/quizzes.interface';

const quizzesSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const QuizzesModel = model<Quizzes & Document>('Quizzes', quizzesSchema);

export default QuizzesModel;
