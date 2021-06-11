import { ProjectStatus, Project } from '../models/project';

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
export class ProjectState extends State<Project> {
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
    this.updateListeners();
  }

  // switch project status
  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);

    // check if status really changed or user just dragged and dropped in the same section, to avoid unnecessary rerender cycle
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      // call the listeners
      this.updateListeners();
    }
  }

  // call the listeners
  updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice()); // send a copy of projects
    }
  }
}

// global singleton instance of ProjectState
export const projectState = ProjectState.getInstance();
