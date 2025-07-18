import { ConstrucaoBase } from "../models/generic/construcao";
import { UnidadeBase } from "../models/generic/unidade";

type FuncaoDistancia = (x1: number, y1: number, x2: number, y2: number) => number;

function encontrarAlvoMaisProximo(unidade: UnidadeBase, alvos: ConstrucaoBase[], distancia: FuncaoDistancia): ConstrucaoBase | null {
  if (alvos.length === 0) return null;

  return alvos.reduce((maisProximo, alvoAtual) => {
    const distAtual = distancia(unidade.x, unidade.y, alvoAtual.x, alvoAtual.y);
    const distMaisProx = distancia(unidade.x, unidade.y, maisProximo.x, maisProximo.y);
    return distAtual < distMaisProx ? alvoAtual : maisProximo;
  });
}

export function encontrarAlvo(
  tropa: UnidadeBase,
  construcoes: ConstrucaoBase[],
  distancia: FuncaoDistancia
): ConstrucaoBase | null {
  
  const alvosVivos = construcoes.filter(c => c.vida > 0);
  if (alvosVivos.length === 0) return null;

  let alvosPrioritarios: ConstrucaoBase[] = [];

  switch (tropa.alvo) {
    case 'defesas':
      alvosPrioritarios = alvosVivos.filter(c => 'danoPorSegundo' in c);
      break;
    case 'recursos':
      alvosPrioritarios = alvosVivos.filter(c =>
        c.constructor.name.includes('Armazem') || c.constructor.name.includes('Coletor')
      );
      break;
    default:
      alvosPrioritarios = alvosVivos;
      break;
  }
  
  if (alvosPrioritarios.length > 0) {
    return encontrarAlvoMaisProximo(tropa, alvosPrioritarios, distancia);
  }
  
  // Fallback para qualquer alvo se a lista prioritária estiver vazia
  return encontrarAlvoMaisProximo(tropa, alvosVivos, distancia);
}