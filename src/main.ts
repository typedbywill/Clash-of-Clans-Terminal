// @ts-nocheck
import { SimuladorDeAtaqueBlessed } from './models/batalha/simuladorBlessed';
import { Canhao } from './models/defesas/canhao';
import { ColetorDeElixir } from './models/recursos/coletorDeElixir';
import { Arqueira } from './models/tropas/arqueira';
import { Barbaro } from './models/tropas/barbaro';
import { Gigante } from './models/tropas/gigante';

// Instancia tropas
const tropas = [
  new Gigante(17, 10),
  new Gigante(18, 10),
  // new Barbaro(16, 9),
];

// Define posições iniciais das tropas
tropas.forEach((tropa, i) => {
  tropa.x = 0;
  tropa.y = i;
});

// Instancia construções
// @ts-ignore
const construcoes = [new Canhao(1), new ColetorDeElixir(1)];

// Define posições fixas das construções
construcoes[0].x = 15; // Canhão
construcoes[0].y = 3;

construcoes[1].x = 17; // Coletor
construcoes[1].y = 6;

// Inicia simulador gráfico
const simulador = new SimuladorDeAtaqueBlessed(tropas, construcoes, 20, 10);
simulador.iniciar();
