import { ProjectInput } from './components/project-input.js'; // we need to add .js if we are not using build tools like webpack
import { ProjectList } from './components/project-list.js';

new ProjectInput();
new ProjectList('active');
new ProjectList('finished');
