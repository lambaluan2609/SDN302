import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

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

export class UpdateQuizDto {
  @IsString()
  public id: string;

  @IsOptional()
  @IsString()
  public title: string;

  @IsOptional()
  @IsString()
  public description: string;
}

export class BulkCreateQuestionsDto {
  @IsArray()
  public questions: Array<CreateQuizQuestionDto>;
}

export class UpdateQuizQuestionDto {
  @IsString()
  public id: string;

  @IsOptional()
  @IsString()
  public text: string;

  @IsOptional()
  @IsArray()
  public options: Array<string>;

  @IsOptional()
  @IsNumber()
  public correctAnswerIndex: number;
}
