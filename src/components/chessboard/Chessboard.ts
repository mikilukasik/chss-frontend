import "./chessboard.scss";

import { component, html } from "../../../../../litState/lib";
import { animateBoardChanges } from "./helpers/animateBoardChanges";
import { chessboardState } from "./chessboardState";
import { BoardCell } from "../chessboardCell/BoardCell";

export const Chessboard = component(
  () => {
    if (chessboardState.prevFen !== chessboardState.fen) {
      animateBoardChanges(
        chessboardState.prevFen,
        chessboardState.fen,
        0.5
      ).then(() => {
        chessboardState.prevFen = chessboardState.fen;
      });

      return document.querySelector(".board-container")?.innerHTML || "";
    }
    const pureFen = chessboardState.prevFen.split(" ")[0].split("/").join("");
    let boardContent = "";

    let col = 0;
    for (const char of pureFen) {
      if (isNaN(parseInt(char))) {
        boardContent += BoardCell({ index: col, char });
        col += 1;
        continue;
      }

      for (let j = 0; j < parseInt(char); j++) {
        boardContent += BoardCell({ index: col });
        col += 1;
      }
    }

    return html`<div class="board">${boardContent}</div>`;
  },
  {
    class: "board-container",
  }
);

// setInterval(() => {
//   chessboardState.fen =
//     chessboardState.fen ===
//     "3rKb1r/1pp2pp1/p1n5/3Pp3/3P4/8/PPP2PPP/R1BQR2k w KQkq - 0 12"
//       ? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
//       : "3rKb1r/1pp2pp1/p1n5/3Pp3/3P4/8/PPP2PPP/R1BQR2k w KQkq - 0 12";
// }, 2000);
