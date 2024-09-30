import { BulkCreateQuestionsDto, CreateQuizDto, CreateQuizQuestionDto } from '@/dtos/quizzes.dto';
import { HttpException } from '@/exceptions/HttpException';
import { Quizzes } from '@/interfaces/quizzes.interface';
import QuestionModel from '@/models/questions.model';
import QuizzesModel from '@/models/quizzes.model';
import { Aggregate, Types } from 'mongoose';

// Service sẽ xử lý các logic về nghiệp vụ, truy xuất db (Repository)
class QuizzesService {
  public async createQuiz(request: CreateQuizDto) {
    return QuizzesModel.create({
      title: request.title,
      description: request.description,
    });
  }
  public async createQuizQuestion(request: CreateQuizQuestionDto, quizId: string) {
    const quiz = await QuizzesModel.findById(quizId);
    if (!quiz) throw new HttpException(400, `Quiz ${quizId} not found`);
    return await QuestionModel.create({
      quizId: quiz.id,
      text: request.text,
      options: request.options,
      correctAnswerIndex: request.correctAnswerIndex,
    });
  }
  public async bulkCreateQuestion(request: BulkCreateQuestionsDto, quizId: string) {
    const quiz = await QuizzesModel.findById(quizId);
    if (!quiz) throw new HttpException(400, `Quiz ${quizId} not found`);
    return await QuestionModel.insertMany(
      request.questions.map(question => ({
        quizId: quiz.id,
        text: question.text,
        options: question.options,
        correctAnswerIndex: question.correctAnswerIndex,
      })),
    );
  }
  public async findAllQuizzes(key: string): Promise<Quizzes[]> {
    const query: Aggregate<any> = QuizzesModel.aggregate().lookup({
      from: 'questions',
      localField: '_id',
      foreignField: 'quizId',
      as: 'questions',
    });
    if (key) {
      query
        .addFields({
          filtered: {
            $filter: {
              input: '$questions',
              as: 'question',
              cond: {
                $regexMatch: {
                  input: '$$question.text',
                  regex: key,
                  options: 'i',
                },
              },
            },
          },
        })
        .match({
          filtered: {
            $gt: {
              $size: 0,
            },
          },
        })
        .project({
          _id: 1,
          title: 1,
          description: 1,
          questions: '$filtered',
        });
    }
    const quizzes: Quizzes[] = await query.exec();
    return quizzes;
  }

  public async findQuizById(quizId: string): Promise<Quizzes> {
    const quizzes: Quizzes[] = await QuizzesModel.aggregate()
      .match({ _id: new Types.ObjectId(quizId) })
      .lookup({
        from: 'questions',
        localField: '_id',
        foreignField: 'quizId',
        as: 'questions',
      })
      .limit(1)
      .exec();

    return quizzes.pop();
  }
  public async deleteQuizById(quizId: string): Promise<Quizzes> {
    const quiz = await QuizzesModel.findById(quizId);
    if (!quiz) throw new HttpException(400, `Quiz ${quizId} not found`);

    await QuestionModel.deleteMany({ quizId });
    await QuizzesModel.deleteOne({ _id: quizId });

    return quiz;
  }
}

export default QuizzesService;
