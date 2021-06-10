/// <reference path='base-component.ts' />

namespace App {
  // ProjectItem class
  export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
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
}
