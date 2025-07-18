// models/batalha/combateGrafico.ts
import { CampoDeBatalha } from '../../engine/campo';
import chalk from 'chalk';
import { ConstrucaoBase } from '../generic/construcao';
import { UnidadeBase } from '../generic/unidade';

export class SimuladorDeAtaqueGrafico {
  private tick: number = 0;
  private delay = 500; // ms por tick
  private campo: CampoDeBatalha;

  constructor(
    private tropas: UnidadeBase[],
    private construcoes: ConstrucaoBase[],
    largura: number = 20,
    altura: number = 10
  ) {
    this.campo = new CampoDeBatalha(largura, altura, tropas, construcoes);
  }

  public async iniciar(): Promise<void> {
    console.clear();
    console.log(chalk.bold('\n⚔️ BATALHA INICIADA!'));

    while (this.tropas.some((t) => t.vida > 0) && this.construcoes.some((c) => c.vida > 0)) {
      this.tick++;
      this.movimentarTropas();
      this.tropasAtacam();
      this.defesasReagem();
      this.campo.atualizarEntidades(this.tropas, this.construcoes);
      this.campo.render(this.tick);
      await this.esperar(this.delay);
    }

    console.log('\n' + chalk.bold('🏁 FIM DE BATALHA'));
    if (this.construcoes.every((c) => c.vida <= 0)) {
      console.log(chalk.greenBright('✅ Vila destruída!'));
    } else {
      console.log(chalk.redBright('❌ Tropas eliminadas.'));
    }
  }

  private movimentarTropas(): void {
    for (const tropa of this.tropas) {
      if (tropa.vida <= 0) continue;

      const alvos = this.construcoes.filter((c) => c.vida > 0);
      if (alvos.length === 0) return;

      // Encontrar o alvo mais próximo
      let alvoMaisProximo = alvos[0];
      let menorDist = this.distancia(tropa.x, tropa.y, alvoMaisProximo.x, alvoMaisProximo.y);

      for (const alvo of alvos) {
        const dist = this.distancia(tropa.x, tropa.y, alvo.x, alvo.y);
        if (dist < menorDist) {
          menorDist = dist;
          alvoMaisProximo = alvo;
        }
      }

      // Se já está no alcance, não se move
      if (menorDist <= tropa.alcanceAtaque()) continue;

      // Calcular próximo passo
      const dx = Math.sign(alvoMaisProximo.x - tropa.x);
      const dy = Math.sign(alvoMaisProximo.y - tropa.y);

      const novoX = tropa.x + dx;
      const novoY = tropa.y + dy;

      // Verificar se nova posição está ocupada por construção viva
      const ocupado = this.construcoes.some((c) => c.vida > 0 && c.x === novoX && c.y === novoY);

      if (!ocupado) {
        tropa.x = novoX;
        tropa.y = novoY;
      }
      // Se ocupado, tropa fica parada (não se move)
    }
  }
  private tropasAtacam(): void {
    for (const tropa of this.tropas) {
      if (tropa.vida <= 0) continue;

      for (const alvo of this.construcoes) {
        if (alvo.vida <= 0) continue;

        const dist = this.distancia(tropa.x, tropa.y, alvo.x, alvo.y);

        if (dist <= tropa.alcanceAtaque()) {
          alvo.receberDano(tropa.atacar());
          break;
        }
      }
    }
  }

  private defesasReagem(): void {
    for (const defesa of this.construcoes) {
      if (defesa.vida <= 0 || typeof (defesa as any).atacar !== 'function') continue;

      for (const tropa of this.tropas) {
        if (tropa.vida <= 0) continue;
        const dist = this.distancia(tropa.x, tropa.y, defesa.x, defesa.y);
        if (dist <= 3) {
          tropa.receberDano((defesa as any).atacar());
          break;
        }
      }
    }
  }

  private distancia(x1: number, y1: number, x2: number, y2: number): number {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  private esperar(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
