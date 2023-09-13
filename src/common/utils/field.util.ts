import { Field } from '../types';

export const generateEmptyField = (): Field => {
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   return [...Array(3)].map(_ => Array(3).fill('')) as Field;
};
