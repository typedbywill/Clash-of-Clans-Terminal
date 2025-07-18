// src/factories/unidade.factory.ts
import { Barbaro } from '../models/tropas/barbaro';
import { Arqueira } from '../models/tropas/arqueira';
import { Gigante } from '../models/tropas/gigante';

const tropasMap: Record<string, any> = {
  Barbaro,
  Arqueira,
  Gigante,
};

export function criarTropa(dados: any) {
  const Classe = tropasMap[dados.classe];
  if (!Classe) throw new Error(`Classe de tropa desconhecida: ${dados.classe}`);
  return Object.assign(new Classe(dados.nivel, dados.atributoExtra1, dados.atributoExtra2), dados);
}
