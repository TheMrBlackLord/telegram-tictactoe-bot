import { Markup } from 'telegraf';
import { Field } from '../types';
import { FIELD_BUTTON_ACTION, buttonValues } from '../constants';

export default function (field: Field) {
   return field.map((row, y) => {
      return row.map((value, x) => {
         return Markup.button.callback(
            `${buttonValues[value]}`,
            `${FIELD_BUTTON_ACTION}_${y}${x}`
         );
      });
   });
}
