import { BulkCreateQuestionsDto, CreateQuizDto, CreateQuizQuestionDto, UpdateQuizDto, UpdateQuizQuestionDto } from '@/dtos/quizzes.dto';
import { HttpException } from '@/exceptions/HttpException';
import { Quizzes } from '@/interfaces/quizzes.interface';
import QuestionModel from '@/models/questions.model';
import QuizzesModel from '@/models/quizzes.model';
import { Aggregate, Types } from 'mongoose';

// Service sẽ xử lý các logic về nghiệp vụ, truy xuất db (Repository)
class QuizzesService {
  //Create Quiz
  public async createQuiz(request: CreateQuizDto) {
    return QuizzesModel.create({
      title: request.title,
      description: request.description,
    });
  }
  //--------------------------------------------------------------------------------------------------------------------

  //Create Question
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
  //------------------------------------------------------------------------------------------------------------------------------------

  //Bulk Create Question
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
  //--------------------------------------------------------------------------------------------------------------------

  //find all quiz
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
  //---------------------------------------------------------------------------------------------------------------------------------------

  // Delete question by questionId
  public async deleteQuizQuestionById(quizId: string, questionId: string) {
    const quiz = await QuizzesModel.findById(quizId);
    if (!quiz) throw new HttpException(400, `Quiz ${quizId} not found`);
    const question = await QuestionModel.findById(questionId);
    if (!question) throw new HttpException(400, `Question ${questionId} not found`);
    await QuestionModel.deleteOne({ _id: questionId });
    return question;
  }
  //---------------------------------------------------------------------------------------------------------------------------------------

  //Update question by questionId
  public async updateQuizQuestionById(request: UpdateQuizQuestionDto, quizId: string) {
    const quiz = await QuizzesModel.findById(quizId);
    if (!quiz) throw new HttpException(400, `Quiz ${quizId} not found`);

    const question = await QuestionModel.findById(request.id);
    if (!question) throw new HttpException(400, `Question ${request.id} not found`);

    if (request.text != undefined) {
      question.text = request.text;
    }
    if (request.options != undefined) {
      question.options = request.options;
    }
    if (request.correctAnswerIndex != undefined) {
      question.correctAnswerIndex = request.correctAnswerIndex;
    }
    return question.save();
  }

  //---------------------------------------------------------------------------------------------------------------------------------------

  //find quiz by quizId
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
  //---------------------------------------------------------------------------------------------------------------------------------------

  //delete quiz by quizId

  public async deleteQuizById(quizId: string): Promise<Quizzes> {
    const quiz = await QuizzesModel.findById(quizId);
    if (!quiz) throw new HttpException(400, `Quiz ${quizId} not found`);

    await QuestionModel.deleteMany({ quizId });
    await QuizzesModel.deleteOne({ _id: quizId });

    return quiz;
  }
  //---------------------------------------------------------------------------------------------------------------------------------------

  //Update quiz by quizId
  public async updateQuiz(request: UpdateQuizDto) {
    const quiz = await QuizzesModel.findById(request.id);
    if (!quiz) throw new HttpException(400, `Quiz ${request.id} not found`);

    if (request.title != undefined) {
      quiz.title = request.title;
    }
    if (request.description != undefined) {
      quiz.description = request.description;
    }
    return quiz.save();
  }
}
//---------------------------------------------------------------------------------------------------------------------------------------

export default QuizzesService;
