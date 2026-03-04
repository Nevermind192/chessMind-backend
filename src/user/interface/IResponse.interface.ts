interface IResponseError {
  ok: false;
  errors: Record<string, string>;
}

interface IResponseSuccess<T> {
  ok: true;
  data: T;
}

export type IResponse<T> = IResponseSuccess<T> | IResponseError;
