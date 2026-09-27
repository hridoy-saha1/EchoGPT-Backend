import {
  IsString,
  IsNotEmpty,
  IsIn,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateAIProviderDto {
  @IsString()
  @IsIn(['OpenAI', 'Anthropic', 'Google'])
  providerName: string;

  @IsString()
  @IsNotEmpty()
  modelName: string;

  @IsString()
  @MinLength(1)
  apiKey: string;
}

export class UpdateAIProviderDto {
  @IsOptional()
  @IsString()
  @IsIn(['OpenAI', 'Anthropic', 'Google'])
  providerName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  modelName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  apiKey?: string;
}