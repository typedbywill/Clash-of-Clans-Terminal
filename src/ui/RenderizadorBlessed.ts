import blessed from 'blessed';
import { MotorDeJogo } from '../core/MotorDeJogo';

export class RenderizadorBlessed {
  private screen = blessed.screen({ smartCSR: true, title: 'Simulador Clash of Clans' });

  private boxMapa = blessed.box({
    label: ' Mapa de Batalha ',
    tags: true,
    top: 0,
    left: 0,
    width: '100%',
    height: '70%',
    border: 'line',
    style: { border: { fg: 'white' } },
  });

  private boxTropas = blessed.box({
    label: ' Tropas ',
    tags: true,
    top: '70%',
    left: 0,
    width: '50%',
    height: '30%',
    border: 'line',
    scrollable: true,
    alwaysScroll: true,
    style: { border: { fg: 'green' } },
  });

  private boxConstr = blessed.box({
    label: ' Construções ',
    tags: true,
    top: '70%',
    left: '50%',
    width: '50%',
    height: '30%',
    border: 'line',
    scrollable: true,
    alwaysScroll: true,
    style: { border: { fg: 'yellow' } },
  });

  constructor() {
    this.screen.append(this.boxMapa);
    this.screen.append(this.boxTropas);
    this.screen.append(this.boxConstr);

    this.screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
  }

  public renderizar(motor: MotorDeJogo): void {
    this.boxMapa.setContent(this.gerarGrid(motor));
    this.boxTropas.setContent(this.statusTropas(motor));
    this.boxConstr.setContent(this.statusConstrucoes(motor));
    this.screen.render();
  }

  public exibirFimDeJogo(resultado: 'VITORIA' | 'DERROTA'): void {
    const mensagem = resultado === 'VITORIA'
      ? '{green-fg}✅ Vila destruída!{/green-fg}'
      : '{red-fg}❌ Tropas eliminadas.{/red-fg}';

    this.boxMapa.setContent(`🏁 {bold}FIM DE BATALHA{/bold}\n\n${mensagem}`);
    this.boxTropas.setContent('');
    this.boxConstr.setContent('');
    this.screen.render();
  }

  private barraDeVida(vida: number, total: number): string {
    const cheios = Math.round((vida / total) * 10);
    const cor = vida === 0 ? 'red-fg' : vida / total < 0.3 ? 'yellow-fg' : 'green-fg';
    return `{${cor}}[${'■'.repeat(cheios)}${' '.repeat(10 - cheios)}]{/${cor}}`;
  }

  private gerarGrid(motor: MotorDeJogo): string {
    const grid: string[][] = Array.from({ length: motor.altura }, () =>
      Array(motor.largura).fill('.')
    );
  
    for (const c of motor.construcoes) {
      if (c.vida > 0) grid[c.y][c.x] = this.simboloConstrucao(c.nome);
    }
  
    for (const t of motor.tropas) {
      if (t.vida <= 0) continue;
      grid[t.y][t.x] = this.simboloTropa(t.nome);
    }
  
    return [`{bold}Tick ${motor.tick}{/bold}`, '', ...grid.map(l => l.join(' '))].join('\n');
  }
  
  private simbolo(nome: string): string {
    return `{black-bg}{white-fg}${nome[0].toUpperCase()}{/white-fg}{/black-bg}`;
  }

  private statusTropas(motor: MotorDeJogo): string {
    return motor.tropas
      .map(t =>
        `• ${t.nome.padEnd(12)} | Vida: ${t.vida.toString().padEnd(4)} ${this.barraDeVida(t.vida, (t as any).maxVida)}`
      )
      .join('\n');
  }

  private statusConstrucoes(motor: MotorDeJogo): string {
    return motor.construcoes
      .map(c =>
        `• ${c.nome.padEnd(16)} | Vida: ${c.vida.toString().padEnd(4)} ${this.barraDeVida(c.vida, (c as any).maxVida)}`
      )
      .join('\n');
  }

  private simboloTropa(nome: string): string {
    return `{black-bg}{green-fg}${nome[0].toUpperCase()}{/green-fg}{/black-bg}`;
  }
  
  private simboloConstrucao(nome: string): string {
    return `{black-bg}{red-fg}${nome[0].toUpperCase()}{/red-fg}{/black-bg}`;
  }

}
