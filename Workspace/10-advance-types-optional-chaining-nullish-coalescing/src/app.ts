type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

// interface ElevatedEmployee extends Employee, Admin {}

type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: 'Max',
  privileges: ['create-server'],
  startDate: new Date(),
};

type Combinable = string | number;
type Numeric = number | boolean;

type Universal = Combinable & Numeric;

// Function overloading
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: string, b: number): string;
function add(a: number, b: string): string;
function add(a: Combinable, b: Combinable) {
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}

const result = add('Max', ' Schwarz');
result.split(' ');

// consider this object being fetched from say HTTP call or DB.
const fetchedUserData = {
  id: 'u1',
  name: 'Max',
  job: { title: 'CEO', description: 'My own company' },
};

// long way of checking if property exists on not (null check)
console.log(fetchedUserData.job && fetchedUserData.job.title);
// optional chaining (short way checking if property exists on not (null check))
console.log(fetchedUserData?.job?.title);

// Nullish Coalescing
const userInput = undefined;
const storedData = userInput ?? 'DEFAULT'; // double question mark. output => 'DEFAULT'
console.log(storedData);

const userInput2 = '';
console.log(userInput2 || 'DEFAULT'); // double OR operator. output => 'DEFAULT'
const storedData2 = userInput2 ?? 'DEFAULT'; // double question mark output => ''
console.log(storedData2);
