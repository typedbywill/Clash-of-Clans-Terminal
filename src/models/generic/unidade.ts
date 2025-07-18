import { AlvoPrioritario, TipoUnidade } from '../../types/unidade';

export abstract class UnidadeBase {

  public alcance: number = 1

  constructor(
    public nome: string,
    public nivel: number,
    public vida: number,
    public dano: number,
    public velocidade: number,
    public tipo: TipoUnidade,
    public alvo: AlvoPrioritario,
    public x: number,
    public y: number
  ) {}

  receberDano(valor: number): void {
    this.vida = Math.max(this.vida - valor, 0);
  }

  atacar(): number {
    return this.dano;
  }

  subirNivel(): void {
    this.nivel++;
    this.melhorarAtributos();
  }

  abstract alcanceAtaque(): number;

  protected abstract melhorarAtributos(): void;
}
