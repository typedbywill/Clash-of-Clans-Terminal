import { ConstrucaoBase } from "./construcao";

export abstract class ConstrucaoDefensiva extends ConstrucaoBase {
  atacar(): number {
    // Implementação do método atacar
    return 0; // Retorne um valor apropriado
  }
  alcanceAtaque(): number {
    // Implementação do método alcanceAtaque
    return 0; // Retorne um valor apropriado
  }
}