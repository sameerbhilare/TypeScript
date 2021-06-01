function add(n1: number, n2: number) {
  // return type 'number'. (type inference)
  return n1 + n2;
}

function printResult(num: number): void {
  console.log('Result: ' + num);
}

printResult(add(5, 12));

//let combineValues: Function // => combineValues is a variable which takes any kind of functions

// now combineValues variables is a function which accept 2 numbers and return a number
// "Function types" are types that describe a function regarding the parameters and the return value of that function.
// <variable-type> <variable-name>: (<function-parameters...>) => <return-type>
let combineValues: (a: number, b: number) => number; // accept 2 numbers and return a number

combineValues = add;
// combineValues = printResult;
// combineValues = 5;

console.log(combineValues(8, 8));

// let someValue: undefined;

// function accepting a callback function
function addAndHandle(n1: number, n2: number, cb: (num: number) => void) {
  // void means ignore
  const result = n1 + n2;
  cb(result);
}

addAndHandle(10, 20, (result) => {
  console.log(result);
});
