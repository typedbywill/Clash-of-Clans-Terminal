import blessed from 'blessed';
import { UnidadeBase } from '../generic/unidade';
import { ConstrucaoBase } from '../generic/construcao';
import { ConstrucaoDefensiva } from '../generic/construcao-defensiva';

export class SimuladorDeAtaqueBlessed {
  private screen = blessed.screen({ smartCSR: true, title: 'Simulador Clash of Clans' });
  private box = blessed.box({
    top: 'center',
    left: 'center',
    width: '80%',
    height: '90%',
    tags: true,
    border: { type: 'line' },
    style: {
      fg: 'white',
      bg: 'black',
      border: { fg: '#f0f0f0' }
    },
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
      ch: ' ',
      // @ts-ignore
      inverse: true
    }
  });

  private tick = 0;
  private delay = 500;

  constructor(
    private tropas: UnidadeBase[],
    private construcoes: ConstrucaoBase[],
    private largura: number = 20,
    private altura: number = 10
  ) {
    this.screen.append(this.box);
    this.screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
  }

  private distancia(x1: number, y1: number, x2: number, y2: number): number {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  private barraDeVida(vida: number, total: number, largura: number = 10): string {
    if (total === 0) return '';
    const cheios = Math.round((vida / total) * largura);
    const vazios = largura - cheios;
    const cor = vida === 0 ? 'red-fg' : vida / total < 0.3 ? 'yellow-fg' : 'green-fg';
    return `{${cor}}[${'■'.repeat(cheios)}${' '.repeat(vazios)}]{/${cor}}`;
  }

  private renderCampo(): string {
    const grid: string[][] = Array.from({ length: this.altura }, () => Array(this.largura).fill('.'));

    const contadorTropas: Record<string, number> = {};
    const ocupacaoTropas: Record<string, string> = {};

    for (const c of this.construcoes) {
      if (c.vida > 0) grid[c.y][c.x] = this.simbolo(c.nome);
    }

    for (const t of this.tropas) {
      if (t.vida <= 0) continue;
      const key = `${t.x},${t.y}`;
      const id = t.nome.split(' ').map(p => p[0]).join('').toUpperCase();
      contadorTropas[key] = (contadorTropas[key] || 0) + 1;
      ocupacaoTropas[key] = id;
    }

    for (const key in contadorTropas) {
      const [xStr, yStr] = key.split(',');
      const x = parseInt(xStr);
      const y = parseInt(yStr);
      const id = ocupacaoTropas[key];
      const count = contadorTropas[key];
      grid[y][x] = `{black-bg}{white-fg}${count > 1 ? count + id : id}{/white-fg}{/black-bg}`;
    }

    const linhas = grid.map((linha) => linha.join(' '));

    const statusTropas = this.tropas.map(
      (t) => ` - ${t.nome} (${t.vida <= 0 ? '{red-fg}MORTA{/red-fg}' : `Vida: ${t.vida} ` + this.barraDeVida(t.vida, (t as any).maxVida || t.vida)})`
    );

    const statusConstr = this.construcoes.map(
      (c) => ` - ${c.nome} (${c.vida <= 0 ? '{red-fg}DESTRUÍDA{/red-fg}' : `Vida: ${c.vida} ` + this.barraDeVida(c.vida, (c as any).maxVida || c.vida)})`
    );

    return [
      `{bold}Tick ${this.tick}{/bold}`,
      '',
      ...linhas,
      '',
      `{underline}Status das Tropas:{/underline}`,
      ...statusTropas,
      '',
      `{underline}Status das Construções:{/underline}`,
      ...statusConstr
    ].join('\n');
  }

  private simbolo(nome: string): string {
    const ini = nome.split(' ').map((n) => n[0]?.toUpperCase()).join('').slice(0, 2);
    return `{black-bg}{white-fg}${ini}{/white-fg}{/black-bg}`;
  }

  private movimentarTropas(): void {
    for (const tropa of this.tropas) {
      if (tropa.vida <= 0) continue;
  
      const alvosVivos = this.construcoes.filter(c => c.vida > 0);
      if (alvosVivos.length === 0) {
        (tropa as any).alvoAtual = null;
        continue;
      }
  
      // 🧠 Filtrar alvos com base na prioridade da tropa
      let alvosFiltrados: ConstrucaoBase[];
  
      switch (tropa.alvo) {
        case 'defesas':
          alvosFiltrados = alvosVivos.filter(c => 'danoPorSegundo' in c);
          break;
        case 'recursos':
          alvosFiltrados = alvosVivos.filter(c =>
            c.constructor.name.includes('Armazem') || c.constructor.name.includes('Coletor')
          );
          break;
        default:
          alvosFiltrados = [];
      }
  
      // 🔁 Fallback: se não encontrou alvos prioritários, atacar qualquer coisa
      if (alvosFiltrados.length === 0) {
        alvosFiltrados = alvosVivos;
      }
  
      if (alvosFiltrados.length === 0) {
        (tropa as any).alvoAtual = null;
        continue;
      }
  
      // 🎯 Encontrar o alvo mais próximo
      const alvoMaisProximo = alvosFiltrados.reduce((maisProximo, alvoAtual) => {
        const distAtual = this.distancia(tropa.x, tropa.y, alvoAtual.x, alvoAtual.y);
        const distMaisProx = this.distancia(tropa.x, tropa.y, maisProximo.x, maisProximo.y);
        return distAtual < distMaisProx ? alvoAtual : maisProximo;
      });
  
      const distFinal = this.distancia(tropa.x, tropa.y, alvoMaisProximo.x, alvoMaisProximo.y);
      (tropa as any).alvoAtual = alvoMaisProximo;
  
      // 🛑 Se está no alcance de ataque, não se move
      if (distFinal <= tropa.alcanceAtaque()) continue;
  
      // 🚶 Cálculo do movimento (prioriza diagonal, depois horizontal, depois vertical)
      const dx = Math.sign(alvoMaisProximo.x - tropa.x);
      const dy = Math.sign(alvoMaisProximo.y - tropa.y);
  
      const movimentosPossiveis: [number, number][] = [];
  
      // Prioridade diagonal (se dx e dy diferentes de zero)
      if (dx !== 0 && dy !== 0) movimentosPossiveis.push([dx, dy]);
      // Horizontal
      if (dx !== 0) movimentosPossiveis.push([dx, 0]);
      // Vertical
      if (dy !== 0) movimentosPossiveis.push([0, dy]);
  
      let movimentoRealizado = false;
  
      for (const [mx, my] of movimentosPossiveis) {
        const novoX = tropa.x + mx;
        const novoY = tropa.y + my;
  
        const dentroDosLimites = novoX >= 0 && novoX < this.largura && novoY >= 0 && novoY < this.altura;
        if (!dentroDosLimites) continue;
  
        // Permite andar na posição do alvo, pois tropa ataca quando estiver no alcance
        const ocupadoPorConstrucao = this.construcoes.some(
          c => c.vida > 0 && c.x === novoX && c.y === novoY && c !== alvoMaisProximo
        );
  
        if (!ocupadoPorConstrucao) {
          tropa.x = novoX;
          tropa.y = novoY;
          movimentoRealizado = true;
          break;
        }
      }
      // Se nenhum movimento possível, tropa permanece parada
    }
  }
  
  
  private tropasAtacam(): void {
    for (const tropa of this.tropas) {
      if (tropa.vida <= 0) continue;
      const alvo = (tropa as any).alvoAtual;
      if (!alvo || alvo.vida <= 0) continue;
  
      const dist = this.distancia(tropa.x, tropa.y, alvo.x, alvo.y);
      if (dist <= tropa.alcanceAtaque()) {
        alvo.receberDano(tropa.atacar());
      }
    }
  }
  
  private defesasReagem(): void {
    for (const defesa of this.construcoes) {
      if (defesa.vida <= 0) continue;
      const alcance = (defesa as any).alcanceAtaque?.();
      const atacar = (defesa as ConstrucaoDefensiva).atacar;
      if (!alcance || !atacar) continue;

      const dano = atacar.bind(defesa)()
  
      // Procurar tropa no alcance mais próximo
      let alvoMaisProximo: UnidadeBase | null = null;
      let menorDist = Infinity;
  
      for (const tropa of this.tropas) {
        if (tropa.vida <= 0) continue;
        const dist = this.distancia(tropa.x, tropa.y, defesa.x, defesa.y);
        if (dist <= alcance && dist < menorDist) {
          menorDist = dist;
          alvoMaisProximo = tropa;
        }
      }
  
      if (alvoMaisProximo) {
        alvoMaisProximo.receberDano(dano);
      }
    }
  }
  

  public async iniciar(): Promise<void> {
    while (this.tropas.some((t) => t.vida > 0) && this.construcoes.some((c) => c.vida > 0)) {
      this.tick++;
      this.movimentarTropas();
      this.tropasAtacam();
      this.defesasReagem();
      this.box.setContent(this.renderCampo());
      this.screen.render();
      await new Promise((r) => setTimeout(r, this.delay));
    }

    const resultado = this.construcoes.every((c) => c.vida <= 0)
      ? '{green-fg}✅ Vila destruída!{/green-fg}'
      : '{red-fg}❌ Tropas eliminadas.{/red-fg}';

    this.box.setContent(`🏁 {bold}FIM DE BATALHA{/bold}\n\n${resultado}`);
    this.screen.render();
  }
}
