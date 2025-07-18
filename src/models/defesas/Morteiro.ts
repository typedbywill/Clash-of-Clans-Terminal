import { ConstrucaoDefensiva } from '../generic/construcao';

export class Morteiro extends ConstrucaoDefensiva {
  private dano: number;
  private alcance: number;

  constructor(nivel: number, x: number, y: number) {
    super(
      'Morteiro',
      nivel,
      300 + nivel * 50,
      90,
      'defensiva',
      500 + nivel * 150,
      x,
      y
    );
    this.dano = 60 + nivel * 15;
    this.alcance = 5 + Math.floor(nivel / 2);
  }

  atacar(): number {
    return this.dano;
  }

  alcanceAtaque(): number {
    return this.alcance;
  }

  protected melhorarAtributos(): void {
    this.vida += 50;
    this.dano += 15;
    if (this.nivel % 2 === 0) {
      this.alcance += 1;
    }
  }
}
