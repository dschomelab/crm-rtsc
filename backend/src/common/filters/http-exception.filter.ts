import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationException } from '../pipes/portuguese-validation.pipe';

const commonTranslations: Record<string, string> = {
  'must be a UUID': 'é obrigatório',
  'must be a string': 'deve ser um texto',
  'must be a number': 'deve ser um número',
  'must be an email': 'Informe um e-mail válido',
  'must be longer than or equal to': 'deve possuir pelo menos',
  'must be shorter than or equal to': 'deve possuir no máximo',
  'should not be empty': 'é obrigatório',
  'must be a boolean': 'deve ser verdadeiro ou falso',
  'must be a Date instance': 'deve ser uma data válida',
  'must be one of the following values': 'Selecione uma opção válida',
};

function translateMessage(message: string): string {
  let result = message;
  for (const [tech, pt] of Object.entries(commonTranslations)) {
    if (result.includes(tech)) {
      result = result.replace(new RegExp(tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), pt);
    }
  }
  return result;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let messages: string[] = ['Ocorreu um erro inesperado. Tente novamente.'];

    if (exception instanceof ValidationException) {
      statusCode = HttpStatus.BAD_REQUEST;
      messages = exception.messages;
    } else if (exception instanceof BadRequestException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse() as any;
      if (Array.isArray(res.message)) {
        messages = res.message.map(translateMessage);
      } else if (typeof res.message === 'string') {
        messages = [translateMessage(res.message)];
      }
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse() as any;
      const msg = typeof res === 'string' ? res : res.message || exception.message;
      messages = [typeof msg === 'string' ? translateMessage(msg) : msg];
    }

    this.logger.error(
      `${request.method} ${request.url} ${statusCode} - ${messages.join(', ')}`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(statusCode).json({
      statusCode,
      messages,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
