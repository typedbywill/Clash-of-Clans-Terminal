import { UnidadeBase } from "../generic/unidade";

export class Goblin extends UnidadeBase {
  constructor(nivel: number, x: number, y: number) {
    super(
      'Goblin',
      nivel,
      50 + nivel * 10,
      10 + nivel * 2,
      4,
      'terrestre',
      'recursos',
      x,
      y
    );
  }

  alcanceAtaque(): number {
    return 1;
  }

  protected melhorarAtributos(): void {
    this.vida += 10;
    this.dano += 2;
  }
}
