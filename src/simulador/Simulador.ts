// src/Simulador.ts (ou onde estiver seu ponto de entrada)

import { MotorDeJogo } from "../core/MotorDeJogo";
import { ConstrucaoBase } from "../models/generic/construcao";
import { UnidadeBase } from "../models/generic/unidade";
import { RenderizadorBlessed } from "../ui/RenderizadorBlessed";

export class Simulador {
  private motorDeJogo: MotorDeJogo;
  private renderizador: RenderizadorBlessed;
  private delay = 1000;

  constructor(
    tropas: UnidadeBase[],
    construcoes: ConstrucaoBase[],
    largura: number = 40,
    altura: number = 15
  ) {
    this.motorDeJogo = new MotorDeJogo(tropas, construcoes, largura, altura);
    this.renderizador = new RenderizadorBlessed();
  }

  public async iniciar(): Promise<void> {
    while (!this.motorDeJogo.jogoAcabou()) {
      this.motorDeJogo.executarTick();
      this.renderizador.renderizar(this.motorDeJogo);
      await new Promise((r) => setTimeout(r, this.delay));
    }

    const resultado = this.motorDeJogo.resultadoFinal();
    this.renderizador.exibirFimDeJogo(resultado);
  }
}