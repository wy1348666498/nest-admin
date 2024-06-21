import { HttpException, HttpStatus } from '@nestjs/common';
import { CodeEnum, CodeMsgEnum } from '../../enums/code.enum';

/**
 * 自定义业务异常类，继承自 HttpException。
 * 可以指定错误消息、错误数据和错误码。
 */
export class BusinessException extends HttpException {
  private readonly errorCode: number;
  private readonly errorData: any;

  /**
   * 构造函数
   * @param message 错误消息，默认为通用错误消息(CodeMsgEnum.ERROR)
   * @param data 错误数据，可选
   * @param code 错误码，可选，默认为 CodeEnum.ERROR
   */
  constructor(message: string = CodeMsgEnum.ERROR, data?: any, code?: number) {
    // 转为数字
    const numCode = code || code !== 0 ? Number(code) : NaN;
    // 验证是否是有效的整数错误码 确定最终的错误码
    const errorCode =
      !isNaN(numCode) && Number.isInteger(numCode) ? numCode : CodeEnum.ERROR;
    // 检查错误码是否是 HTTP 状态码
    const isHttpCode = Object.values(HttpStatus).includes(errorCode);
    // 确定最终的 HTTP 状态码
    const statusCode = isHttpCode ? errorCode : HttpStatus.OK;

    // 调用父类的构造函数，创建异常体
    super(
      HttpException.createBody({
        code: errorCode,
        data,
        message,
      }),
      statusCode,
    );

    // 保存错误码和错误数据到实例变量
    this.errorCode = errorCode;
    this.errorData = data || null;
  }

  /**
   * 获取错误码
   * @returns 错误码
   */
  getErrorCode(): number {
    return this.errorCode;
  }

  /**
   * 获取错误数据
   * @returns 错误数据
   */
  getErrorData(): any {
    return this.errorData;
  }
}

// 导出 BusinessException 类别名 BizException
export { BusinessException as BizException };
