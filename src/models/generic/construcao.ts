import { TipoConstrucao, EstadoConstrucao } from '../../types/construcoes';

export abstract class ConstrucaoBase {
  public estado: EstadoConstrucao = 'ativa';

  constructor(
    public nome: string,
    public nivel: number,
    public vida: number,
    public tempoConstrucao: number,
    public tipo: TipoConstrucao,
    public custoConstrução: number,
    public x: number, // posição X no campo (coluna)
    public y: number // posição Y no campo (linha)
  ) {}

  receberDano(dano: number): void {
    this.vida = Math.max(this.vida - dano, 0);
    if (this.vida === 0) {
      this.estado = 'destruida';
    }
  }

  iniciarMelhoria(): void {
    if (this.estado === 'ativa') {
      this.estado = 'melhorando';
    }
  }

  concluirMelhoria(): void {
    if (this.estado === 'melhorando') {
      this.nivel++;
      this.melhorarAtributos();
      this.estado = 'ativa';
    }
  }

  protected abstract melhorarAtributos(): void;
}
