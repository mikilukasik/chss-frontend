import { createState, component, html } from "../../../../../litState/lib";
import "./chessboard.scss";
import { BoardSquare } from "./BoardSquare";

const chessboardState = createState({
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
});

export const Chessboard = component(
  () => {
    const pureFen = chessboardState.fen.split(" ")[0].split("/").join("");
    let boardContent = "";

    let col = 0;
    for (const char of pureFen) {
      if (isNaN(parseInt(char))) {
        boardContent += BoardSquare({ index: col, char });
        col += 1;
        continue;
      }

      for (let j = 0; j < parseInt(char); j++) {
        boardContent += BoardSquare({ index: col });
        col += 1;
      }
    }

    return html`<div class="board">${boardContent}</div>`;
  },
  {
    class: "board-container",
  }
);
