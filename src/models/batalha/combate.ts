import { ConstrucaoBase } from '../generic/construcao';
import { UnidadeBase } from '../generic/unidade';

export class SimuladorDeAtaque {
  private tropas: UnidadeBase[];
  private construcoes: ConstrucaoBase[];
  private tick: number = 0;

  constructor(tropas: UnidadeBase[], construcoes: ConstrucaoBase[]) {
    this.tropas = tropas;
    this.construcoes = construcoes;
  }

  public async iniciar(): Promise<void> {
    console.clear();
    console.log(`\n🌪️ Iniciando batalha...\n`);

    while (this.tropas.some((t) => t.vida > 0) && this.construcoes.some((c) => c.vida > 0)) {
      this.tick++;
      console.log(`📦 Tick ${this.tick}`);

      this.tropasAtacam();
      this.defesasReagem();

      await this.esperar(5000);
      console.log('\n');
    }

    console.log(`🛑 Fim da Batalha`);
    if (this.construcoes.every((c) => c.vida === 0)) {
      console.log(`✅ Vila destruída com sucesso!`);
    } else {
      console.log(`❌ Ataque falhou, todas as tropas foram eliminadas.`);
    }
  }

  private tropasAtacam(): void {
    for (const tropa of this.tropas) {
      if (tropa.vida <= 0) continue;

      const alvo = this.construcoes.find((c) => c.vida > 0);
      if (!alvo) break;

      const dano = tropa.atacar();
      alvo.receberDano(dano);

      console.log(`⚔️ ${tropa.nome} atacou ${alvo.nome} causando ${dano} de dano (vida restante: ${alvo.vida})`);
    }
  }

  private defesasReagem(): void {
    const defesas = this.construcoes.filter(
      (c) => c.vida > 0 && 'atacar' in c && typeof (c as any).atacar === 'function'
    );

    for (const defesa of defesas) {
      const alvo = this.tropas.find((t) => t.vida > 0);
      if (!alvo) break;

      const dps = (defesa as any).atacar();
      alvo.receberDano(dps);

      console.log(`🏹 ${defesa.nome} atacou ${alvo.nome} causando ${dps} de dano (vida restante: ${alvo.vida})`);
    }
  }

  private esperar(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
