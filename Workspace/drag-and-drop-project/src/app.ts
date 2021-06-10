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
type Listener<T> = (items: T[]) => void;

// Base State class for application wide state.
// Though in this small application, we are only storing Project state
class State<T> {
  // protected so that can be accessible from child
  protected listeners: Listener<T>[] = [];

  public addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

// Project State Management
// Singleton class
class ProjectState extends State<Project> {
  // whenever something changes in the application state (projects), we call our listeners
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  public static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
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

// component base class
// using generics bcz hostElement and element can be of different types
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string // optional parameter must be last
  ) {
    this.templateElement = document.getElementById(templateId) as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId) as T;

    // render the form
    // this.templateElement.content gives us whatever inside of <template> tag
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as U; // get element from node
    if (newElementId) {
      this.element.id = newElementId; // for proper css
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtStart ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  abstract configure(): void;

  abstract renderContent(): void;
}

// ProjecList class
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  // literal type
  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProjects = [];

    // not calling these methods from base class constructor
    // because these methods might depend on some data from this (child) class which will of course not be available in parent
    this.configure();
    this.renderContent();
  }

  configure() {
    // register listener for projectstate
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === 'active') {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });

      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    listEl.innerHTML = ''; // clear existing rendered contents to avoid duplicate projects rendering
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }
}

// ProjectInput class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
