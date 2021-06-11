// we need to add .js if we are not using build tools like webpack
// do not pass extension if we are using webpack.
import { ProjectInput } from './components/project-input';
import { ProjectList } from './components/project-list';

new ProjectInput();
new ProjectList('active');
new ProjectList('finished');
