// ====================
// Built-in Generics - Array, Promise
// const names: Array<string> = []; // string[]
// // names[0].split(' ');

// const promise: Promise<number> = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(10);
//   }, 2000);
// });

// promise.then(data => {
//   // data.split(' ');
// })

// ====================
// Generic Function with constraint
function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}

const mergedObj = merge({ name: 'Max', hobbies: ['Sports'] }, { age: 30 });
console.log(mergedObj);

// Generic Function. Example 2
interface Lengthy {
  length: number; // length property so that it can be used for string, array as both have length property
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let descriptionText = 'Got no value.';
  // can be used for string, array as both have length property
  if (element.length === 1) {
    descriptionText = 'Got 1 element.';
  } else if (element.length > 1) {
    descriptionText = 'Got ' + element.length + ' elements.';
  }
  return [element, descriptionText];
}

console.log(countAndDescribe(['Sports', 'Cooking']));

// ==================
// "keyof" constraint
// T is any kind of object. U is any kind of key in T object
function extractAndConvert<T extends object, U extends keyof T>(obj: T, key: U) {
  return 'Value: ' + obj[key];
}

extractAndConvert({ name: 'Max' }, 'name');

// ==================
// Generic Classes
// Here T shoud be  string | number | boolean
// because removeItem() method's indexOf doesn't work properly with object type if we pass two differnt objects even though of same content (due to pass by reference).
// and for objecttype, we would need special handling
class DataStorage<T extends string | number | boolean> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    if (this.data.indexOf(item) === -1) {
      return;
    }
    this.data.splice(this.data.indexOf(item), 1); // -1
  }

  getItems() {
    return [...this.data];
  }
}

// ==================
// DataStorage for strings
const textStorage = new DataStorage<string>();
textStorage.addItem('Max');
textStorage.addItem('Manu');
textStorage.removeItem('Max');
console.log(textStorage.getItems());

// DataStorage for numbers
const numberStorage = new DataStorage<number>();

// const objStorage = new DataStorage<object>();
// const maxObj = {name: 'Max'};
// objStorage.addItem(maxObj);
// objStorage.addItem({name: 'Manu'});
// // ...
// objStorage.removeItem(maxObj);
// console.log(objStorage.getItems());

// =========================
// Generic Utility Types
interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

function createCourseGoal(title: string, description: string, date: Date): CourseGoal {
  // Partial Type (built-in)
  // In the end, courseGoal will be of type CourseGoal
  // but INITIALLY Partial kind of wraps our own type (CourseGoal) and changes it to a type
  // where all the properties of our type (CourseGoal) are optional.
  let courseGoal: Partial<CourseGoal> = {};

  courseGoal.title = title;
  courseGoal.description = description;
  courseGoal.completeUntil = date;

  // typecasting 'Partial' to actual type
  return courseGoal as CourseGoal;
}

// Readonly Type (built-in) - to have readonly data
const names: Readonly<string[]> = ['Max', 'Anna'];
// names.push('Manu'); // error
// names.pop();        // error
