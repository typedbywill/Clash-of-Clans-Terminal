import { UnidadeBase } from "../generic/unidade";

export class Gigante extends UnidadeBase {
  public maxVida = 300;
  public alcance = 1

  constructor(x: number, y: number) {
    super('Gigante', 1, 300, 15, 1,'terrestre', 'defesas',  x, y,); // dano reduzido, vida alta
  }

  atacar(): number {
    return this.dano;
  }

  alcanceAtaque(): number {
    return this.alcance;
  }

  protected melhorarAtributos(): void {
    
  }

}
