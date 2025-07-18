import { UnidadeBase } from "../generic/unidade";

export class Mago extends UnidadeBase {
  constructor(nivel: number, x: number, y: number) {
    super(
      'Mago',
      nivel,
      80 + nivel * 18,
      40 + nivel * 8,
      2,
      'terrestre',
      'qualquer',
      x,
      y
    );
  }

  alcanceAtaque(): number {
    return 6;
  }

  protected melhorarAtributos(): void {
    this.vida += 18;
    this.dano += 8;
  }
}
