// src/ui/RenderizadorBlessed.ts

import blessed from 'blessed';
import { MotorDeJogo } from '../core/MotorDeJogo';

export class RenderizadorBlessed {
  private screen = blessed.screen({ smartCSR: true, title: 'Simulador Clash of Clans' });
  private box = blessed.box({
    top: 'center',
    left: 'center',
    width: '80%',
    height: '90%',
    tags: true,
    border: { type: 'line' },
    style: {
      fg: 'white', bg: 'black', border: { fg: '#f0f0f0' }
    },
    scrollable: true,
    alwaysScroll: true,
// @ts-ignore
    scrollbar: { ch: ' ', inverse: true }
  });

  constructor() {
    this.screen.append(this.box);
    this.screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
  }

  public renderizar(motor: MotorDeJogo): void {
    const conteudo = this.gerarConteudo(motor);
    this.box.setContent(conteudo);
    this.screen.render();
  }

  public exibirFimDeJogo(resultado: 'VITORIA' | 'DERROTA'): void {
    const mensagem = resultado === 'VITORIA'
      ? '{green-fg}✅ Vila destruída!{/green-fg}'
      : '{red-fg}❌ Tropas eliminadas.{/red-fg}';

    this.box.setContent(`🏁 {bold}FIM DE BATALHA{/bold}\n\n${mensagem}`);
    this.screen.render();
  }
  
  private barraDeVida(vida: number, total: number, largura: number = 10): string {
    if (total === 0) return '';
    const cheios = Math.round((vida / total) * largura);
    const vazios = largura - cheios;
    const cor = vida === 0 ? 'red-fg' : vida / total < 0.3 ? 'yellow-fg' : 'green-fg';
    return `{${cor}}[${'■'.repeat(cheios)}${' '.repeat(vazios)}]{/${cor}}`;
  }

  private simbolo(nome: string): string {
    const ini = nome.split(' ').map((n) => n[0]?.toUpperCase()).join('').slice(0, 2);
    return `{black-bg}{white-fg}${ini}{/white-fg}{/black-bg}`;
  }

  private gerarConteudo(motor: MotorDeJogo): string {
    const grid: string[][] = Array.from({ length: motor.altura }, () => Array(motor.largura).fill('.'));

    // Lógica de renderização (praticamente a mesma de antes, mas usando o estado do motor)
    const contadorTropas: Record<string, number> = {};
    const ocupacaoTropas: Record<string, string> = {};

    for (const c of motor.construcoes) {
      if (c.vida > 0) grid[c.y][c.x] = this.simbolo(c.nome);
    }
    for (const t of motor.tropas) {
      if (t.vida <= 0) continue;
      const key = `${t.x},${t.y}`;
      const id = t.nome.split(' ').map(p => p[0]).join('').toUpperCase();
      contadorTropas[key] = (contadorTropas[key] || 0) + 1;
      ocupacaoTropas[key] = id;
    }
    for (const key in contadorTropas) {
      const [yStr, xStr] = key.split(',').reverse(); // Ajuste conforme sua implementação de X,Y
      const x = parseInt(xStr), y = parseInt(yStr);
      grid[y][x] = `{black-bg}{white-fg}${contadorTropas[key] > 1 ? contadorTropas[key] + ocupacaoTropas[key] : ocupacaoTropas[key]}{/white-fg}{/black-bg}`;
    }

    const linhas = grid.map(linha => linha.join(' '));
    const statusTropas = motor.tropas.map(t => ` - ${t.nome} (${t.vida <= 0 ? '{red-fg}MORTA{/red-fg}' : `Vida: ${t.vida} ` + this.barraDeVida(t.vida, (t as any).maxVida)})`);
    const statusConstr = motor.construcoes.map(c => ` - ${c.nome} (${c.vida <= 0 ? '{red-fg}DESTRUÍDA{/red-fg}' : `Vida: ${c.vida} ` + this.barraDeVida(c.vida, (c as any).maxVida)})`);

    return [
        `{bold}Tick ${motor.tick}{/bold}`, '', ...linhas, '',
        `{underline}Status das Tropas:{/underline}`, ...statusTropas, '',
        `{underline}Status das Construções:{/underline}`, ...statusConstr
    ].join('\n');
  }
}