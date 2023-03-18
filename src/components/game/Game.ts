import { component, html } from "../../../../../litState/lib";
import { Chessboard } from "../chessboard/Chessboard";

export const Game = component(
  () =>
    html`<div>Game</div>
      <div>${Chessboard()}</div>`
);
