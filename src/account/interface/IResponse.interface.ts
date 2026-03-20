export interface IResponseError {
  ok: false;
  errors: Record<string, Record<string, string>>;
}

interface IResponseSuccess<T = void> {
  ok: true;
  data: T;
}

export type IResponse<T = void> = IResponseSuccess<T> | IResponseError;
