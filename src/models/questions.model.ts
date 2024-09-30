import { model, Schema, Document, Types } from 'mongoose';
import { Questions } from '@/interfaces/questions.interface';

const questionsSchema: Schema = new Schema({
  quizId: {
    type: Types.ObjectId,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  correctAnswerIndex: {
    type: Number,
    required: true,
  },
});

const QuestionModel = model<Questions & Document>('Questions', questionsSchema);

export default QuestionModel;
