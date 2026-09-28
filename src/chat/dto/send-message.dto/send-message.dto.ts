import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsUUID,
} from 'class-validator';

export class SendMessageDto {
  @IsOptional()
  @IsUUID()
  conversationId?: string;
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsIn(['OpenAI', 'Anthropic', 'Google'])
  providerName?: string;
}
