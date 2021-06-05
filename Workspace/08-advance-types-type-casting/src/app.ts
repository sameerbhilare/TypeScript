// Type Casting - Way 1
// The exclamation mark at the end allows us to tell TypeScript that the expression in front of it will never yield null.
// if we are not sure wheather the expression will be null or not, we can use the if check as used below.
// const userInputElement = <HTMLInputElement>document.getElementById('user-input')!;
const userInputElement = document.getElementById('user-input');

if (userInputElement) {
  // Type Casting - Way 2. This syntax is used in React as above syntax(using <>) clashes with React's syntax
  // HTMLInputElement is globally available because it is included ia tsconfig -> lib -> 'dom'
  (userInputElement as HTMLInputElement).value = 'Hi there!';
}
