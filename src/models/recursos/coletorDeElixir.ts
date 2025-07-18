import { ConstrucaoBase } from '../generic/construcao';

export class ColetorDeElixir extends ConstrucaoBase {
  public capacidade: number;
  public taxaPorHora: number;
  private armazenado: number = 0;

  constructor(nivel: number = 1, x: number, y: number) {
    super('Coletor de Elixir', nivel, 400 + (nivel - 1) * 70, 45, 'recurso', 800, x, y);
    this.capacidade = 1000 + (nivel - 1) * 500;
    this.taxaPorHora = 200 + (nivel - 1) * 100;
  }

  produzirElixir(horas: number): void {
    const produzido = this.taxaPorHora * horas;
    this.armazenado = Math.min(this.capacidade, this.armazenado + produzido);
  }

  coletar(): number {
    const valor = this.armazenado;
    this.armazenado = 0;
    return valor;
  }

  protected melhorarAtributos(): void {
    this.capacidade += 500;
    this.taxaPorHora += 100;
    this.vida += 70;
    this.custoConstrução += 600;
  }
}
