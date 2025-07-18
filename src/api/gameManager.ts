// src/api/gameManager.ts

import { MotorDeJogo } from '../core/MotorDeJogo';
import { UnidadeBase } from '../models/generic/unidade';
import { ConstrucaoBase } from '../models/generic/construcao';

let motor: MotorDeJogo | null = null;

export const GameManager = {
  iniciarJogo(tropas: UnidadeBase[], construcoes: ConstrucaoBase[], largura: number, altura: number) {
    motor = new MotorDeJogo(tropas, construcoes, largura, altura);
  },

  executarTick() {
    if (!motor) throw new Error('Jogo não iniciado');
    motor.executarTick();
    return motor;
  },

  estadoAtual() {
    if (!motor) throw new Error('Jogo não iniciado');
    return motor;
  },

  resultadoFinal() {
    if (!motor) throw new Error('Jogo não iniciado');
    return {
      acabou: motor.jogoAcabou(),
      resultado: motor.resultadoFinal()
    };
  }
};
