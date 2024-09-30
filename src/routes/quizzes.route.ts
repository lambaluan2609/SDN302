import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import QuizzesController from '@/controllers/quizzes.controller';
import { BulkCreateQuestionsDto, CreateQuizDto, CreateQuizQuestionDto } from '@/dtos/quizzes.dto';

class QuizzesRoute implements Routes {
  public path = '/quizzes';
  public router = Router();
  public quizzesController = new QuizzesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.quizzesController.findAllQuizzes);
    this.router.get(`${this.path}/:quizId/question`, this.quizzesController.findQuizById);
    this.router.get(`${this.path}`, this.quizzesController.findAllQuizzes);
    this.router.post(`${this.path}`, validationMiddleware(CreateQuizDto, 'body'), this.quizzesController.createQuizzes);
    this.router.post(`${this.path}/:quizId/question`, validationMiddleware(CreateQuizQuestionDto, 'body'), this.quizzesController.createQuizQuestion);
    this.router.post(
      `${this.path}/:quizId/questions`,
      validationMiddleware(BulkCreateQuestionsDto, 'body'),
      this.quizzesController.createBulkQuestion,
    );
    this.router.delete(`${this.path}/:quizId`, this.quizzesController.deleteQuizById);
  }
}

export default QuizzesRoute;
