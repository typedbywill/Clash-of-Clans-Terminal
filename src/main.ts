// @ts-nocheck
import { Canhao } from './models/defesas/canhao';
import { ColetorDeElixir } from './models/recursos/coletorDeElixir';
import { Arqueira } from './models/tropas/arqueira';
import { Barbaro } from './models/tropas/barbaro';
import { Gigante } from './models/tropas/gigante';
import { Simulador } from './simulador/Simulador';

function criarTropas(): Array<TropaBase> {
  const tropas = [
    new Gigante(17, 10),
    new Arqueira(18, 10),
    new Barbaro(18, 10),
  ];

  tropas.forEach((tropa, i) => {
    tropa.x = 0;
    tropa.y = i;
  });

  return tropas;
}

function criarConstrucoes(): Array<ConstrucaoBase> {
  const canhao = new Canhao(1);
  canhao.x = 15;
  canhao.y = 3;

  const coletor = new ColetorDeElixir(1);
  coletor.x = 17;
  coletor.y = 6;

  return [canhao, coletor];
}

const tropas = criarTropas();
const construcoes = criarConstrucoes();

const simulador = new Simulador(tropas, construcoes);
simulador.iniciar();
