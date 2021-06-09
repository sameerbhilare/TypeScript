// This function is to be used as a decorator
// Decorator Factory
function Logger(logString: string) {
  console.log('LOGGER FACTORY');
  return function (constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

// Returning (and changing) a Class in a Class Decorator
function WithTemplate(template: string, hookId: string) {
  console.log('TEMPLATE FACTORY');
  return function <T extends { new (...args: any[]): { name: string } }>(originalConstructor: T) {
    // class is just syntactic suger for writing Function constructors
    return class extends originalConstructor {
      // underscore as a name which basically signals to TypeScript
      // that yeah, I know I get this argument, but I don't need it but I have to specify it, though.
      // this will run only when we instantiate the original class object
      constructor(..._: any[]) {
        super(); // call orginalConstructor first
        console.log('Rendering template');
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector('h1')!.textContent = this.name;
        }
      }
    };
  };
}

// In front of '@', we should add function name which will be a decorator
// @Logger('LOGGING - PERSON')
@Logger('LOGGING')
@WithTemplate('<h1>My Person Object</h1>', 'app')
class Person {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}

const pers = new Person();

console.log(pers);

// ===========================
// ---

/*
  If you add a decorator to a property, the decorator receives two arguments 
  1. The target of the property. 
     - For instance property (property in a class), the target will be the prototype of the object. 
     - If we had a static property, target would refer to the constructor function instead.
  2. And second argument is the name of the property.
*/
// Property Decorator
function Log(target: any, propertyName: string | Symbol) {
  console.log('Property decorator!');
  console.log(target, propertyName);
}

// Accessor Decorator
function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log('Accessor decorator!');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// Method Decorator
function Log3(target: any, name: string | Symbol, descriptor: PropertyDescriptor) {
  console.log('Method decorator!');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// Parameter Decorator
function Log4(target: any, name: string | Symbol, position: number) {
  console.log('Parameter decorator!');
  console.log(target);
  console.log(name);
  console.log(position);
}

class Product {
  // Property Decorator
  @Log
  title: string;
  private _price: number;

  // Accessor Decorator
  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error('Invalid price - should be positive!');
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  // Method Decorator
  @Log3
  // Parameter Decorator
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}

const p1 = new Product('Book', 19);
const p2 = new Product('Book 2', 29);

function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

class Printer {
  message = 'This works!';

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();
p.showMessage();

const button = document.querySelector('button')!;
button.addEventListener('click', p.showMessage);

// ---
// ValidatorConfig, registeredValidators, Required, PositiveNumber, validate - all these could be part of third party lib
interface ValidatorConfig {
  [property: string]: {
    [validatableProp: string]: string[]; // ['required', 'positive']
  };
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
  // target.constructor.name => e.g. Course
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name], // keep existing validators
    [propName]: [...registeredValidators[target.constructor.name][propName], 'required'], // add new validator
  };
}

function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [...registeredValidators[target.constructor.name][propName], 'positive'],
  };
}

function validate(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  if (!objValidatorConfig) {
    return true;
  }
  let isValid = true;
  for (const prop in objValidatorConfig) {
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case 'required':
          isValid = isValid && !!obj[prop];
          break;
        case 'positive':
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}

class Course {
  // using the validator decorator
  @Required
  title: string;
  // using the validator decorator
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector('form')!;
courseForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const titleEl = document.getElementById('title') as HTMLInputElement;
  const priceEl = document.getElementById('price') as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  const createdCourse = new Course(title, price);

  // validating a class for all applied validator decorators
  if (!validate(createdCourse)) {
    alert('Invalid input, please try again!');
    return;
  }
  console.log(createdCourse);
});
