import {
    createParamDecorator,
    ExecutionContext,
} from '@nestjs/common';

export const TokenPayload = createParamDecorator(
    async (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      // const payload = await this.jwtService.verifyToken(request.cookies['access_token']);
      return request.protocol;
    },
);