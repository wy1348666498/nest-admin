import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { BusinessException } from '../exceptions/biz.exception';
import { CodeMsgEnum } from '../../enums/code.enum';
import { getIp } from '../../utils/ip.util';

interface MyError {
  readonly status: number;
  readonly statusCode?: number;
  readonly message?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor() {
    // 注册全局异常处理钩子
    this.registerCatchAllExceptionsHook();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const url = request.url;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : (exception as MyError)?.status ||
          (exception as MyError)?.statusCode ||
          HttpStatus.INTERNAL_SERVER_ERROR;
    const apiErrorData =
      exception instanceof BusinessException ? exception.getErrorData() : null;

    let message =
      (exception as any)?.response?.message ||
      (exception as MyError)?.message ||
      `${exception}`;

    // 系统内部错误时
    if (
      status === HttpStatus.INTERNAL_SERVER_ERROR &&
      !(exception instanceof BusinessException)
    ) {
      Logger.error(exception, undefined, 'Catch');
      message = CodeMsgEnum.SERVER_ERROR;
    } else {
      this.logger.warn(
        `错误信息：(${status}) ${message} Path: ${decodeURI(url)} IP：${getIp(request)}`,
      );
    }
    const apiErrorCode: number =
      exception instanceof BusinessException
        ? exception.getErrorCode()
        : status;

    // 返回基础响应结果
    const resBody: IBaseResponse = {
      code: apiErrorCode,
      message,
      data: apiErrorData,
    };

    response.status(status).send(resBody);
  }

  registerCatchAllExceptionsHook() {
    process.on('unhandledRejection', (reason) => {
      console.error('unhandledRejection: ', reason);
    });

    process.on('uncaughtException', (err) => {
      console.error('uncaughtException: ', err);
    });
  }
}
