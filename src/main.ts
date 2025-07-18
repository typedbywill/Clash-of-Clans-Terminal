// @ts-nocheck
import { Canhao } from './models/defesas/canhao';
import { Morteiro } from './models/defesas/Morteiro';
import { TorreDeArqueiras } from './models/defesas/torre-arqueira';
import { ColetorDeElixir } from './models/recursos/coletorDeElixir';
import { Arqueira } from './models/tropas/arqueira';
import { Balao } from './models/tropas/balao';
import { Barbaro } from './models/tropas/barbaro';
import { Gigante } from './models/tropas/gigante';
import { Goblin } from './models/tropas/goblin';
import { Mago } from './models/tropas/mago';
import { Simulador } from './simulador/Simulador';

function criarTropas(): Array<TropaBase> {
  const tropas = [
    new Gigante(17, 10),
    new Arqueira(18, 10),
    new Barbaro(18, 10),
    new Mago(1, 18, 10),
    new Goblin(1, 0, 0),
    new Balao(1,0,0)
  ];

  tropas.forEach((tropa, i) => {
    tropa.x = 0;
    tropa.y = i;
  });

  return tropas;
}

function criarConstrucoes(): Array<ConstrucaoBase> {
  const canhao = new Canhao(1);
  canhao.x = 17;
  canhao.y = 5;

  const coletor = new ColetorDeElixir(1, 17, 6);

  const torreArqueira = new TorreDeArqueiras(1, 17, 7)

  const morteiro = new Morteiro(1, 17, 8)

  return [canhao, coletor, torreArqueira, morteiro];

}

const tropas = criarTropas();
const construcoes = criarConstrucoes();

const simulador = new Simulador(tropas, construcoes);
simulador.iniciar();
