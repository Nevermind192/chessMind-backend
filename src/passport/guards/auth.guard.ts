import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    try {
      const [bearer, token] = request.headers['authorization']?.split(' ');
      const payload = verify(token, process.env.JWT_SECRET_KEY);
      console.log(payload);
      return true;
    } catch {
      throw new UnauthorizedException('Нет доступа');
    }
  }
}
