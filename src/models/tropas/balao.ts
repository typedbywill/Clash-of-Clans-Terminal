import { UnidadeBase } from "../generic/unidade";

export class Balao extends UnidadeBase {
  constructor(nivel: number, x: number, y: number) {
    super(
      'Balão',
      nivel,
      120 + nivel * 30,
      60 + nivel * 12,
      3,
      'aérea',
      'defesas',
      x,
      y
    );
  }

  alcanceAtaque(): number {
    return 1;
  }

  protected melhorarAtributos(): void {
    this.vida += 30;
    this.dano += 12;
  }
}
