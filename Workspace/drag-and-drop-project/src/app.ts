// Project type
enum ProjectStatus {
  Active,
  Finished,
}

// Project class
// using class not interface because we want to instantiate it
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// listener type - any function which receives Project array and returns void
type Listener = (items: Project[]) => void;

// Project State Management
// Singleton class
class ProjectState {
  // whenever something changes in the application state (projects), we call our listeners
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {}

  public static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  public addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  public addProject(title: string, description: string, numOfPeople: number) {
    const newProject: Project = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active // every new project is by default is Active
    );
    this.projects.push(newProject);
    // call the listeners
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice()); // send a copy of projects
    }
  }
}

// global singleton instance of ProjectState
const projectState = ProjectState.getInstance();

// validation
// defining structure of the validatable object
interface Validatable {
  value: string | number;
  // optional
  required?: boolean; // required: boolean | undefined;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatable: Validatable) {
  let isValid = true;

  if (validatable.required) {
    isValid = isValid && validatable.value.toString().trim().length !== 0;
  }
  if (validatable.minLength != null && typeof validatable.value === 'string') {
    isValid = isValid && validatable.value.trim().length >= validatable.minLength;
  }
  if (validatable.maxLength != null && typeof validatable.value === 'string') {
    isValid = isValid && validatable.value.trim().length <= validatable.maxLength;
  }
  if (validatable.min != null && typeof validatable.value === 'number') {
    isValid = isValid && validatable.value >= validatable.min;
  }
  if (validatable.max != null && typeof validatable.value === 'number') {
    isValid = isValid && validatable.value <= validatable.max;
  }

  return isValid;
}

// Autobind decorator - A method decorator
// decorator, which we can add, which automatically binds to 'this' key word
// so that we don't have to call bind() in the addEventListener
// The first and second parameters are not used so TS gives compiation error.
// Hence using underscore as a special syntax which TS understands and hence does not complain
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value; // store the method which we originally defined.
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjustedDescriptor;
}

// ProjecList class
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: Project[];

  // literal type
  constructor(private type: 'active' | 'finished') {
    this.templateElement = document.getElementById('project-list') as HTMLTemplateElement;
    this.hostElement = document.getElementById('app') as HTMLDivElement;
    this.assignedProjects = [];

    // render the form
    // this.templateElement.content gives us whatever inside of <template> tag
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLElement; // get element from node
    this.element.id = `${this.type}-projects`; // for proper css

    // register listener for projectstate
    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
  }

  private attach() {
    this.hostElement.insertAdjacentElement('beforeend', this.element);
  }
}

// ProjectInput class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById('project-input') as HTMLTemplateElement;
    this.hostElement = document.getElementById('app') as HTMLDivElement;

    // render the form
    // this.templateElement.content gives us whatever inside of <template> tag
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement; // get element from node
    this.element.id = 'user-input'; // for proper css

    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

    this.configure();
    this.attach();
  }

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
      console.log(title, description, people);
      // add to global projects
      projectState.addProject(title, description, people);
      // clear user entered inputs
      this.clearInput();
    }
  }

  // setup event listeners
  private configure() {
    /* 
        if bind() is not used, then 'this' inside of submitHandler() function will point to 
        event.target element. This is how JS works in event handling.
        By using bind(this), 'this' inside submitHandler() function will point to this class's instance.      
    */
    //this.element.addEventListener('submit', this.submitHandler.bind(this));

    this.element.addEventListener('submit', this.submitHandler); // bind not required because of our custom decorator
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
