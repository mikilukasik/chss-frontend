import "./chessboard.scss";

import { component, html } from "../../../litState/src";
import { chessboardState } from "./helpers/chessboardState";
import { BoardCell } from "../chessboardCell/BoardCell";

export const Chessboard = component(
  () => {
    const pureFen = chessboardState.prevFen.split(" ")[0].split("/").join("");
    let boardContent = "";

    let cellIndex = 0;
    for (const char of pureFen) {
      if (isNaN(parseInt(char))) {
        boardContent += BoardCell(`board-cell-${cellIndex}`, {
          index: cellIndex,
          char,
        });
        cellIndex += 1;
        continue;
      }

      for (let j = 0; j < parseInt(char); j++) {
        boardContent += BoardCell(`board-cell-${cellIndex}`, {
          index: cellIndex,
        });
        cellIndex += 1;
      }
    }

    const res = html`<div class="board">${boardContent}</div>`;

    return res;
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

// (function () {
//   const observer = new MutationObserver(function (mutations) {
//     mutations.forEach(function (mutation) {
//       mutation.addedNodes.forEach(function (node: any) {
//         try {
//           // console.log(mutation);
//           node.style.border = "4px solid red";
//           setTimeout(function () {
//             node.style.border = "";
//           }, 500);
//         } catch (e) {
//           // console.error(e);
//         }
//       });
//     });
//   });

//   observer.observe(document.body, {
//     childList: true,
//     subtree: true,
//   });
// })();
