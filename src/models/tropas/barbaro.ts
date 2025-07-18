import { UnidadeBase } from '../generic/unidade';

export class Barbaro extends UnidadeBase {
  constructor(nivel: number = 1, x: number, y: number) {
    super('Bárbaro', nivel, 45 + (nivel - 1) * 15, 8 + (nivel - 1) * 3, 16, 'terrestre', 'qualquer', x, y);
  }

  protected melhorarAtributos(): void {
    this.vida += 15;
    this.dano += 3;
  }

  alcanceAtaque(): number {
    return 1;
  }
}
