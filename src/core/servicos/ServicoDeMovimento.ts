import { ConstrucaoBase } from "../../models/generic/construcao";
import { UnidadeBase } from "../../models/generic/unidade";

/**
 * Calcula e aplica o movimento de uma tropa em direção ao seu alvo.
 * A função modifica diretamente as coordenadas X e Y do objeto 'tropa'.
 * * @param tropa A unidade que deve se mover.
 * @param alvo A construção alvo para a qual a tropa está se movendo.
 * @param construcoes A lista de todas as construções para checagem de colisão.
 * @param largura A largura do campo de batalha para checagem de limites.
 * @param altura A altura do campo de batalha para checagem de limites.
 */
export function movimentarTropa(
  tropa: UnidadeBase,
  alvo: ConstrucaoBase,
  construcoes: ConstrucaoBase[],
  largura: number,
  altura: number
): void {

  const dx = Math.sign(alvo.x - tropa.x);
  const dy = Math.sign(alvo.y - tropa.y);

  const movimentosPossiveis: [number, number][] = [];

  if (dx !== 0 && dy !== 0) {
    movimentosPossiveis.push([dx, dy]);
  }
  if (dx !== 0) {
    movimentosPossiveis.push([dx, 0]);
  }
  if (dy !== 0) {
    movimentosPossiveis.push([0, dy]);
  }

  for (const [mx, my] of movimentosPossiveis) {
    const novoX = tropa.x + mx;
    const novoY = tropa.y + my;

    const dentroDosLimites = novoX >= 0 && novoX < largura && novoY >= 0 && novoY < altura;
    if (!dentroDosLimites) {
      continue;
    }

    const celulaOcupada = construcoes.some(
      c => c.vida > 0 && c.x === novoX && c.y === novoY && c !== alvo
    );

    if (!celulaOcupada) {
      tropa.x = novoX;
      tropa.y = novoY;
      return;
    }
  }
}