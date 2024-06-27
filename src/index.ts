import express from 'express';
import generateRouter from './router';

const app = express();
const port = 3012;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
generateRouter(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
