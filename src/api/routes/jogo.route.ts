// src/api/routes/jogo.route.ts

import { Router } from 'express';
import { GameManager } from '../gameManager';
import { criarTropa } from '../../factories/unidade.factory';
import { criarConstrucao } from '../../factories/construcao.factory';

export const jogoRouter = Router();

jogoRouter.post('/iniciar', (req, res) => {
  const { tropas, construcoes, largura, altura } = req.body;

  try {
    const tropasInstanciadas = tropas.map(criarTropa);
    const construcoesInstanciadas = construcoes.map(criarConstrucao);

    GameManager.iniciarJogo(tropasInstanciadas, construcoesInstanciadas, largura, altura);
    res.json({ status: 'Jogo iniciado' });
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});


jogoRouter.post('/tick', (req, res) => {
  try {
    const motor = GameManager.executarTick();
    res.json({ tick: motor.tick, tropas: motor.tropas, construcoes: motor.construcoes });
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

jogoRouter.get('/estado', (req, res) => {
  try {
    const motor = GameManager.estadoAtual();
    res.json({ tick: motor.tick, tropas: motor.tropas, construcoes: motor.construcoes });
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

jogoRouter.get('/resultado', (req, res) => {
  try {
    res.json(GameManager.resultadoFinal());
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});
