import { HttpException, HttpStatus } from '@nestjs/common';

export class UserExistsException extends HttpException {
  constructor(message: object) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
