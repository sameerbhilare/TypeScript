// Drag & Drop interfaces
/*
    Drag and drop interfaces not just to define the structure of some objects
    but instead to really set up a contract which certain classes can assign to force these classes 
    to basically implement certain methods that help us with drag and drop.
*/
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  // to basically signal the browser and JavaScript that the thing you're dragging something over is a valid drag target.
  // If you don't do the right thing in the drag over handler dropping will not be possible.
  dragOverHandler(event: DragEvent): void;

  // You need to drop Handler then to react to the actual drop that happens.
  // So if the drag over handler will permit to drop, and with the drop handler will handle the drop.
  // And then here we can update our data and UI, for example.
  dropHandler(event: DragEvent): void;

  // And to drag leave handler can be useful if we're, for example, giving some visual feedback to the user
  // when he or she drags something over the box, for example, we change the background color.
  // If no drop happens and instead it's cancelled or the user removes the element the way,
  // then we can use to drag leave handler to revert to our visual update.
  dragLeaveHandler(event: DragEvent): void;
}

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

// ProjectItem class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  private project: Project;

  // getter to transform data when we retrieve it
  get persons() {
    if (this.project.people === 1) {
      return '1 person';
    } else {
      return this.project.people + ' persons';
    }
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent): void {
    // dataTransfer is special property for DragEvent
    // on that dataTransfer property you can attach data to the drag event
    // and you'll later be able to extract that data upon a drop.
    // And the browser and JavaScript behind the scenes will store that data during the drag operation
    // and ensure that the data you get when the drop happens, it's the same data you attach here.
    event.dataTransfer!.setData('text/plain', this.project.id);

    // This basically controls how the cursor will look like
    // and tells the browser a little bit about our intention that we plan to move an element from A to B
    // and alternative could be copy, where you then get a different cursor, which indicates to the user that you're copying and not moving.
    event.dataTransfer!.effectAllowed = 'move';
  }

  @autobind
  dragEndHandler(_: DragEvent): void {
    console.log('Drag End!');
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}

// ProjecList class
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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

  @autobind
  dragOverHandler(event: DragEvent): void {
    // allowing dropping of plain text
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      // In JavaScript, drag and drop works such that a drop event will only trigger on an element
      // if in the dragover handler on that same element you called prevent default.

      // The default for JavaScript drag and drop events is to not allow dropping.
      // So you have to prevent default in the drag over handler to tell JavaScript into browser
      // that for this element you want to allow a drop.
      event.preventDefault();

      const listEl = this.element.querySelector('ul');
      listEl?.classList.add('droppable');
    }
  }

  @autobind
  dropHandler(event: DragEvent): void {
    // this will execute only if event.preventDefault(); in dragOverHandler() is called
    console.log(event.dataTransfer!.getData('text/plain'));
  }

  @autobind
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.element.querySelector('ul');
    listEl?.classList.remove('droppable');
  }

  configure() {
    // register drag & drop related listeners
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);

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
      new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
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
