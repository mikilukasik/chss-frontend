import { component, html } from "../../../litState/src";
import { DisplayBoard } from "../displayBoard/DisplayBoard";

export const GameStateModal = component(({ resolve, fen, sortedMoves }) => {
  return html`
    ${DisplayBoard({ fen, moves: sortedMoves })}
    ${sortedMoves.map(
      ({ moveString, score }: { moveString: string; score: number }) =>
        html`<div>${moveString} ${score}</div>`
    )}
  `;
});
