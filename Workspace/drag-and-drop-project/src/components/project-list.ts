/// <reference path='base-component.ts' />

namespace App {
  // ProjecList class
  export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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
      const prjId = event.dataTransfer!.getData('text/plain');
      projectState.moveProject(
        prjId,
        this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
      );
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
}
