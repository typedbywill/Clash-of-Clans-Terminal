import { ConstrucaoDefensiva } from '../generic/construcao';

export class Canhao extends ConstrucaoDefensiva {
  public danoPorSegundo: number;
  public alcance: number;

  constructor(nivel: number = 1) {
    super('Canhão', nivel, 420 + (nivel - 1) * 80, 60, 'defensiva', 1000, 1, 1);
    this.danoPorSegundo = 9 + (nivel - 1) * 4;
    this.alcance = 3;
  }

  atacar(): number {
    return this.danoPorSegundo;
  }

  alcanceAtaque(): number {
    return this.alcance;
  }

  protected melhorarAtributos(): void {
    this.vida += 80;
    this.danoPorSegundo += 4;
    this.alcance += 0.5;
    this.custoConstrução += 500;
  }
}
