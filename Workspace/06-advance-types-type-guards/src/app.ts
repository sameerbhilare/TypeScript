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

function add(a: Combinable, b: Combinable) {
  // this is type guard using typeof operator (type 1)
  // because it allows us to utilize the flexibility union types gives us
  // and still ensure that our code runs correctly at runtime.
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}

// union type
type UnknownEmployee = Employee | Admin;

function printEmployeeInformation(emp: UnknownEmployee) {
  console.log('Name: ' + emp.name);

  // type guard
  // if 'privileges' exists as a property on employee.
  if ('privileges' in emp) {
    console.log('Privileges: ' + emp.privileges);
  }

  // type guard (type 2)
  // if 'startDate' exists as a property on employee.
  if ('startDate' in emp) {
    console.log('Start Date: ' + emp.startDate);
  }
}

printEmployeeInformation(e1);
printEmployeeInformation({ name: 'Manu', startDate: new Date() });

class Car {
  drive() {
    console.log('Driving...');
  }
}

class Truck {
  drive() {
    console.log('Driving a truck...');
  }

  loadCargo(amount: number) {
    console.log('Loading cargo ...' + amount);
  }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();
  // type guard using instanceof (type 3)
  if (vehicle instanceof Truck) {
    vehicle.loadCargo(1000);
  }

  // this also works
  /*
  if ('loadCargo' in vehicle) {
    vehicle.loadCargo(1000);
  } */
}

useVehicle(v1);
useVehicle(v2);
