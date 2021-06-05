interface ErrorContainer {
  // { email: 'Not a valid email', username: 'Must start with a character!' }
  // defining index type
  // here [prop: string] will hold any string as key name and any number of such keys e.g. email, username
  // and :string is the value which will hold e.g. 'Not a valid email', 'Must start with a character!'
  [prop: string]: string;
}

const errorBag: ErrorContainer = {
  email: 'Not a valid email!',
  username: 'Must start with a capital character!',
};

const errorBag2: ErrorContainer = {
  key1: 'Value 1',
  key2: 'Value 2',
  1: 'number key is interpreted as string',
};
