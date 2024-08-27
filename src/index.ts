import dotenv from 'dotenv';
import express from 'express';
import { GetRoomUseInfos } from './browser';

dotenv.config();

const app = express();
app.use(express.json());
app.get('/', async (req, res) => {
  GetRoomUseInfos({
    username: process.env.SHUSTUID!,
    password: process.env.SHUSTUPWD!,
  })
    .then((infos) => {
      res.json({
        code: 0,
        message: 'success',
        infos,
      });
    })
    .catch((err) => {
      res.status(500);
      res.json({
        code: -1,
        message: err,
      });
    });
});
app.listen(9000, () => {
  console.log('Server started on http://localhost:9000');
});