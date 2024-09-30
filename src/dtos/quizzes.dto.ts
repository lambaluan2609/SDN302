import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateQuizDto {
  @IsString()
  public title: string;

  @IsString()
  public description: string;
}

export class CreateQuizQuestionDto {
  @IsString()
  public text: string;

  @IsArray()
  public options: Array<string>;

  @IsNumber()
  public correctAnswerIndex: number;
}

export class BulkCreateQuestionsDto {
  @IsArray()
  public questions: Array<CreateQuizQuestionDto>;
}
