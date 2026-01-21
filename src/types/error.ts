export interface IFieldError {
  field: string;
  description: string;
}

export interface IErrorResponse {
  statusCode: number;
  message: string;
  errors: IFieldError[];
}
