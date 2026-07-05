import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const read = (question) => {
  return new Promise((resolve) => {
    rl.question(question + '\n', (answer) => {
      resolve(answer);
    });
  });
};

export const write = (args) => console.log(args);
