import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { TelegrafContext } from '../context';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { LOCALE } from '../locale';

export const Locale = createParamDecorator((_, ctx: ExecutionContext) => {
   const language =
      TelegrafExecutionContext.create(ctx).getContext<TelegrafContext>().session.language;
   return LOCALE[language];
});
