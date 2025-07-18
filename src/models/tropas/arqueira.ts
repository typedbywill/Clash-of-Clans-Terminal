import { UnidadeBase } from '../generic/unidade';

export class Arqueira extends UnidadeBase {
  public alcance: number = 3;

  constructor(nivel: number = 1, x: number, y: number) {
    super(
      'Arqueira',
      nivel,
      35 + (nivel - 1) * 10, // vida menor que bárbaro
      7 + (nivel - 1) * 2, // dano levemente menor, mas à distância
      18, // velocidade maior
      'terrestre',
      'qualquer',
      x,
      y
    );
  }

  atacar(): number {
    // Arqueira ataca com dano base
    return this.dano;
  }

  alcanceAtaque(): number {
    return this.alcance;
  }

  protected melhorarAtributos(): void {
    this.vida += 10;
    this.dano += 2;
  }
}
