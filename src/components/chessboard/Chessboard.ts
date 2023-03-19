import { createState, component, html } from "../../../../../litState/lib";
import "./chessboard.scss";
import { BoardSquare } from "./BoardSquare";
import { animateBoardChanges } from "./helpers/animateBoardChanges";

const chessboardState = createState({
  fen: "3rkb1r/1pp2pp1/p1n5/3Pp3/3P4/8/PPP2PPP/R1BQK2R w KQkq - 0 12",
  prevFen: "3rkb1r/1pp2pp1/p1n5/3Pp3/3P4/8/PPP2PPP/R1BQK2R w KQkq - 0 12",
});

setInterval(() => {
  chessboardState.fen =
    chessboardState.fen ===
    "3rkb1r/1pp2pp1/p1n5/3Pp3/3P4/8/PPP2PPP/R1BQK2R w KQkq - 0 12"
      ? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
      : "3rkb1r/1pp2pp1/p1n5/3Pp3/3P4/8/PPP2PPP/R1BQK2R w KQkq - 0 12";
}, 3000);
setTimeout(() => {
  chessboardState.fen =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
}, 1000);

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
