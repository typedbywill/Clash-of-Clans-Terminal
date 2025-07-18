// src/factories/construcao.factory.ts
import { Canhao } from '../models/defesas/canhao';
import { Morteiro } from '../models/defesas/Morteiro';
import { TorreDeArqueiras } from '../models/defesas/torre-arqueira';
import { ColetorDeElixir } from '../models/recursos/coletorDeElixir';

const construcaoMap: Record<string, any> = {
  Canhao,
  ColetorDeElixir,
  Morteiro,
  TorreDeArqueiras,

};

export function criarConstrucao(dados: any) {
  const Classe = construcaoMap[dados.classe];
  if (!Classe) throw new Error(`Classe de construção desconhecida: ${dados.classe}`);
  return Object.assign(new Classe(dados.nivel, dados.atributoExtra1, dados.atributoExtra2), dados);
}
