import chalk from 'chalk';
import { UnidadeBase } from '../models/generic/unidade';
import { ConstrucaoBase } from '../models/generic/construcao';

export class CampoDeBatalha {
  public largura: number;
  public altura: number;

  private tropas: UnidadeBase[];
  private construcoes: ConstrucaoBase[];

  private cores = [chalk.blue, chalk.red, chalk.green, chalk.magenta, chalk.cyan, chalk.yellow, chalk.white];

  constructor(
    largura: number = 20,
    altura: number = 10,
    tropas: UnidadeBase[] = [],
    construcoes: ConstrucaoBase[] = []
  ) {
    this.largura = largura;
    this.altura = altura;
    this.tropas = tropas;
    this.construcoes = construcoes;
  }

  private hashNome(nome: string): number {
    // Simples hash para distribuir cores
    let hash = 0;
    for (let i = 0; i < nome.length; i++) {
      hash = (hash << 5) - hash + nome.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  private simboloDinamico(nome: string): string {
    const hash = this.hashNome(nome);
    const corFn = this.cores[hash % this.cores.length];
    // Pega as primeiras 2 letras maiúsculas
    const label = nome
      .split(' ')
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 2);
    // Retorna o label colorido com fundo escuro para contraste
    return corFn.bgBlack(` ${label} `);
  }

  public render(tick?: number): void {
    const grid: string[][] = Array.from({ length: this.altura }, () => Array(this.largura).fill('.'));

    for (const c of this.construcoes) {
      if (c.vida <= 0) continue;
      grid[c.y][c.x] = this.simboloDinamico(c.nome);
    }

    for (const t of this.tropas) {
      if (t.vida <= 0) continue;
      grid[t.y][t.x] = this.simboloDinamico(t.nome);
    }

    console.clear();
    if (tick !== undefined) {
      console.log(`Tick atual: ${tick}\n`);
    } else {
      console.log(`Estado do campo:\n`);
    }
    for (const linha of grid) {
      console.log(linha.join(''));
    }

    console.log('\nLegenda dinâmica baseada nas iniciais de cada entidade.\n');
  }

  public atualizarEntidades(tropas: UnidadeBase[], construcoes: ConstrucaoBase[]): void {
    this.tropas = tropas;
    this.construcoes = construcoes;
  }
}
