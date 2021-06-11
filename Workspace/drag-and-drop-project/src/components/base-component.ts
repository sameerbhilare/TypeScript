// component base class
// using generics bcz hostElement and element can be of different types
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
