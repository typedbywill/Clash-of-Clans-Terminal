import { ConstrucaoDefensiva } from '../generic/construcao';

export class TorreDeArqueiras extends ConstrucaoDefensiva {
  private dano: number;
  private alcance: number = 10

  constructor(nivel: number, x: number, y: number) {
    super(
      'Torre de Arqueiras',
      nivel,
      250 + nivel * 40,
      60,
      'defensiva',
      400 + nivel * 100,
      x,
      y
    );
    this.dano = 40 + nivel * 8;
    this.alcance = 7 + nivel; 
  }

  atacar(): number {
    return this.dano;
  }

  alcanceAtaque(): number {
    return this.alcance;
  }

  protected melhorarAtributos(): void {
    this.vida += 40;
    this.dano += 8;
    this.alcance += 1;
  }
}
