import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';

import todoRoutes from './routes/todos';

const app = express();

// json() middleware provided by a third party package which will pass the bodies of all incoming requests
// and extract any JSON data it finds in there to then populate the req.body object with the parsed json data.
app.use(json());

app.use('/todos', todoRoutes);

// error handling middleware function, which will be fired automatically by express
// if in any other middleware prior to this one you have an error.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.listen(3000);
