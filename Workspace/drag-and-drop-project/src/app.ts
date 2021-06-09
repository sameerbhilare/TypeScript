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

  private submitHandler(event: Event) {
    // get access to the input element values
    event.preventDefault(); // to prevent default form submission which submits an HTTP request
    console.log(this.titleInputElement.value);
  }

  // setup event listeners
  private configure() {
    /* if bind() is not used, then 'this' inside of submitHandler() function will point to 
    event.target element. This is how JS works in event handling.
    By using bind(this), 'this' inside submitHandler() function will point to this class's instance.
      
    */
    this.element.addEventListener('submit', this.submitHandler.bind(this));
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const prjInput = new ProjectInput();
