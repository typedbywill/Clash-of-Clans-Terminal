// src/core/MotorDeJogo.ts

import { ConstrucaoBase } from "../models/generic/construcao";
import { ConstrucaoDefensiva } from "../models/generic/construcao-defensiva";
import { UnidadeBase } from "../models/generic/unidade";
import { encontrarAlvo } from "./EstrategiaDeMira";
import { movimentarTropa } from "./servicos/ServicoDeMovimento";


export class MotorDeJogo {
  public tick: number = 0;

  constructor(
    public tropas: UnidadeBase[],
    public construcoes: ConstrucaoBase[],
    public largura: number,
    public altura: number
  ) {
    this.tropas.forEach(t => (t as any).maxVida = t.vida);
    this.construcoes.forEach(c => (c as any).maxVida = c.vida);
  }

  public executarTick(): void {
    this.tick++;
    this.movimentarTropas();
    this.tropasAtacam();
    this.defesasReagem();
  }

  public jogoAcabou(): boolean {
    const semTropasVivas = !this.tropas.some((t) => t.vida > 0);
    const semConstrucoesVivas = !this.construcoes.some((c) => c.vida > 0);
    return semTropasVivas || semConstrucoesVivas;
  }

  public resultadoFinal(): 'VITORIA' | 'DERROTA' {
      return this.construcoes.every((c) => c.vida <= 0) ? 'VITORIA' : 'DERROTA';
  }
  
  private distancia(x1: number, y1: number, x2: number, y2: number): number {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  private movimentarTropas(): void {
    for (const tropa of this.tropas) {
      if (tropa.vida <= 0) continue;

      const alvo = encontrarAlvo(tropa, this.construcoes, (x1, y1, x2, y2) => this.distancia(x1, y1, x2, y2));
      (tropa as any).alvoAtual = alvo;

      if (!alvo) continue;
      
      const distFinal = this.distancia(tropa.x, tropa.y, alvo.x, alvo.y);
      if (distFinal <= tropa.alcanceAtaque()) continue;
      
      movimentarTropa(tropa, alvo, this.construcoes, this.largura, this.altura);
    }
  }

  private tropasAtacam(): void {
    for (const tropa of this.tropas) {
      if (tropa.vida <= 0) continue;
      const alvo = (tropa as any).alvoAtual;
      if (!alvo || alvo.vida <= 0) continue;

      const dist = this.distancia(tropa.x, tropa.y, alvo.x, alvo.y);
      if (dist <= tropa.alcanceAtaque()) {
        alvo.receberDano(tropa.atacar());
      }
    }
  }

  private defesasReagem(): void {
    const defesas: ConstrucaoDefensiva[] = this.construcoes.filter(c=> c.tipo === 'defensiva') as ConstrucaoDefensiva[]

    for (const defesa of defesas) {
      const alcance = defesa.alcanceAtaque();
      const tropasVivasNoAlcance = this.tropas.filter(
        t => t.vida > 0 && this.distancia(t.x, t.y, defesa.x, defesa.y) <= alcance
      );

      if (tropasVivasNoAlcance.length === 0) continue;

      const alvoMaisProximo = tropasVivasNoAlcance.reduce((a, b) =>
        this.distancia(a.x, a.y, defesa.x, defesa.y) < this.distancia(b.x, b.y, defesa.x, defesa.y) ? a : b
      );

      alvoMaisProximo.receberDano(defesa.atacar());
    }
  }
}