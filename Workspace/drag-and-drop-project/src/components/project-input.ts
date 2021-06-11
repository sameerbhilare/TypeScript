import { Component } from './base-component';
import { Validatable, validate } from '../util/validation';
import { autobind } from '../decorators/autobind';
import { projectState } from '../state/project-state';

// ProjectInput class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');

    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

    this.configure();
  }

  // setup event listeners
  configure() {
    /* 
        if bind() is not used, then 'this' inside of submitHandler() function will point to 
        event.target element. This is how JS works in event handling.
        By using bind(this), 'this' inside submitHandler() function will point to this class's instance.      
    */
    //this.element.addEventListener('submit', this.submitHandler.bind(this));

    this.element.addEventListener('submit', this.submitHandler); // bind not required because of our custom decorator
  }

  renderContent(): void {}

  // return tuple of exactly 3 elements of exactly specified types
  // or return void which is same as undefined but used with function return types
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = { value: enteredTitle, required: true };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    // validation
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert('Invalid Input, Please try again!');
      return; // undefined
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInput() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  // using our decorator
  @autobind
  private submitHandler(event: Event) {
    // get access to the input element values
    event.preventDefault(); // to prevent default form submission which submits an HTTP request
    const userInput = this.gatherUserInput();

    // tuple is in the end just array. So we can use Array.isArray to check if we got undefined or an array
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput; // using destructuring
      // add to global projects
      projectState.addProject(title, description, people);
      // clear user entered inputs
      this.clearInput();
    }
  }
}
