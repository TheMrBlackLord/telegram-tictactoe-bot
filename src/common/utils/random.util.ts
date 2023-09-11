export const chance50 = () => {
   const number = Math.floor(Math.random() * 100) + 1;
   return number > 50;
};
