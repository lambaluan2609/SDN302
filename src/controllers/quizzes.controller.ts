import { NextFunction, Request, Response } from 'express';
import QuizzesService from '@/services/quizzes.service';

// Controller sẽ đảm nhiệm xử lý chức năng (không bao gồm xử lý logic)
class QuizzesController {
  public quizzesService = new QuizzesService();

  public createQuizzes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newQuiz = await this.quizzesService.createQuiz(req.body);
      return res.status(201).json({ data: newQuiz, message: 'Create quiz successfully' });
    } catch (error) {
      next(error);
    }
  };
  public createQuizQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quizId = req.params.quizId;
      const newQuiz = await this.quizzesService.createQuizQuestion(req.body, quizId);
      return res.status(201).json({ data: newQuiz, message: 'Create quiz successfully' });
    } catch (error) {
      next(error);
    }
  };
  public createBulkQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quizId = req.params.quizId;
      const newQuiz = await this.quizzesService.bulkCreateQuestion(req.body, quizId);
      return res.status(201).json({ data: newQuiz, message: 'Create bulk question successfully' });
    } catch (error) {
      next(error);
    }
  };
  public findAllQuizzes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = req.query['key'] || '';
      console.log('key', key);
      const findAllQuizzes = await this.quizzesService.findAllQuizzes(key as string);
      return res.status(200).json({ data: findAllQuizzes, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };
  public findQuizById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quizId = req.params.quizId;
      const findOneQuiz = await this.quizzesService.findQuizById(quizId);
      return res.status(200).json({ data: findOneQuiz, message: 'find Quiz by id' });
    } catch (error) {
      next(error);
    }
  };
  public deleteQuizById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleteQuiz = await this.quizzesService.deleteQuizById(req.params.quizId);
      return res.status(200).json({ data: deleteQuiz, message: 'delete Quiz by id' });
    } catch (error) {
      next(error);
    }
  };
}

export default QuizzesController;
