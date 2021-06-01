let userInput: unknown;
let userName: string;

userInput = 5;
userInput = 'Max';

// userName = userInput; // this line gives compilation error.

// if we perform type checking, then below code compiles fine
if (typeof userInput === 'string') {
  userName = userInput;
}

// 'never' is another type, functions can return. it just menas the function never returns anything.
function generateError(message: string, code: number): never {
  throw { message: message, errorCode: code };
  // while (true) {}
}

generateError('An error occurred!', 500);
