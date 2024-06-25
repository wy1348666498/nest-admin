import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { getIp } from '../../utils/ip.util';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger(LoggingInterceptor.name, { timestamp: false });

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const call$ = next.handle();
    const request = context.switchToHttp().getRequest();
    const content = `[${request.method},${request.url}]; 来源IP -> ${getIp(request)};`;
    const isSse = request.headers.accept === 'text/event-stream';
    this.logger.debug(
      `+++ 请求：${content} 请求参数 -> body:${JSON.stringify(request.body)}, query:${JSON.stringify(request.query)}`,
    );

    const now = Date.now();

    return call$.pipe(
      tap(() => {
        if (isSse) return;

        this.logger.debug(`--- 响应：${content} +${Date.now() - now}ms`);
      }),
    );
  }
}
