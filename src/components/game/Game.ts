import { component, html } from "../../../litState/src";
import { Chessboard } from "../chessboard/Chessboard";
import "./game.scss";

export const Game = component(
  () => html`
    <div class="game-wrapper">
      <div class="chessboard-wrapper">${Chessboard("main-chessboard")}</div>
      <div class="right-panel">this is the right panel</div>
    </div>
  `
);
