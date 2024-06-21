declare global {
  export interface IBaseResponse<T = any> {
    message: string;
    code: number;
    data?: T;
  }
}

export {};
