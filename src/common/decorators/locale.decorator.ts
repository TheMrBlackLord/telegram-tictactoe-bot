import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { TelegrafContext } from '../context';
import { LOCALE } from '../locale';

export const Locale = createParamDecorator((_, ctx: ExecutionContext) => {
   const language =
      TelegrafExecutionContext.create(ctx).getContext<TelegrafContext>().session.language;
   return LOCALE[language];
});
