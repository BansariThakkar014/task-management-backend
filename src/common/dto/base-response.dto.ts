export class BaseResponseDto<T>{
  status: number;
  message: string;
  error?: string | Record<string, string[]>;
  data?: T;
}