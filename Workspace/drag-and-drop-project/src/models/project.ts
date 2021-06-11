// Project type
export enum ProjectStatus {
  Active,
  Finished,
}

// Project class
// using class not interface because we want to instantiate it
export class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}
