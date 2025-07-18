// src/api/index.ts

import express from 'express';
import cors from 'cors';
import { jogoRouter } from './routes/jogo.route';

const app = express();
const PORT = 3005;

app.use(cors());
app.use(express.json());

app.use('/jogo', jogoRouter);

app.listen(PORT, () => {
  console.log(`Servidor de simulação iniciado em http://localhost:${PORT}`);
});
