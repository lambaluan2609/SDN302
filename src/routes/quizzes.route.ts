import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import QuizzesController from '@/controllers/quizzes.controller';
import { BulkCreateQuestionsDto, CreateQuizDto, CreateQuizQuestionDto, UpdateQuizDto, UpdateQuizQuestionDto } from '@/dtos/quizzes.dto';

class QuizzesRoute implements Routes {
  public path = '/quizzes';
  public router = Router();
  public quizzesController = new QuizzesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //Get All Quiz
    this.router.get(`${this.path}`, this.quizzesController.findAllQuizzes);

    //Find Quiz by ID
    this.router.get(`${this.path}/:quizId/question`, this.quizzesController.findQuizById);

    //Post Quiz
    this.router.post(`${this.path}`, validationMiddleware(CreateQuizDto, 'body'), this.quizzesController.createQuizzes);

    //Update Quiz
    this.router.put(`${this.path}`, validationMiddleware(UpdateQuizDto, 'body', true), this.quizzesController.updateQuizById);

    //delete quiz
    this.router.delete(`${this.path}/:quizId`, this.quizzesController.deleteQuizById);

    //Create Question
    this.router.post(`${this.path}/:quizId/question`, validationMiddleware(CreateQuizQuestionDto, 'body'), this.quizzesController.createQuizQuestion);

    //Bulk Create Question
    this.router.post(
      `${this.path}/:quizId/questions`,
      validationMiddleware(BulkCreateQuestionsDto, 'body'),
      this.quizzesController.createBulkQuestion,
    );

    // Update Question
    this.router.put(`${this.path}/:quizId/question`, validationMiddleware(UpdateQuizQuestionDto), this.quizzesController.updateQuizQuestionById);

    //Delete Question
    this.router.delete(`${this.path}/:quizId/question/:questionId`, this.quizzesController.deleteQuizQuestionById);
  }
}

export default QuizzesRoute;
