import { HttpStatus } from '@nestjs/common';

export enum CodeEnum {
  /** 成功 */
  SUCCESS = HttpStatus.OK,
  /** 失败 */
  ERROR = 1,
}

export enum CodeMsgEnum {
  /** 成功 */
  SUCCESS = '成功',
  /** 失败 */
  ERROR = '失败',
  /** 服务繁忙 */
  SERVER_ERROR = '服务繁忙，请稍后再试',
}
