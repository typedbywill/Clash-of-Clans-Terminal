import { ConstrucaoBase } from "./construcao";

export interface ConstrucaoDefensiva extends ConstrucaoBase {
  atacar(): number;
  alcanceAtaque(): number;
}