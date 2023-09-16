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
        boardContent += BoardCell({
          index: cellIndex,
          char,
          id: `board-cell-${cellIndex}`,
        });
        cellIndex += 1;
        continue;
      }

      for (let j = 0; j < parseInt(char); j++) {
        boardContent += BoardCell({
          index: cellIndex,
          id: `board-cell-${cellIndex}`,
        });
        cellIndex += 1;
      }
    }

    return html`<div
      class="main-board${chessboardState.rotated ? " upside-down" : ""}"
    >
      ${boardContent}
    </div>`;
  },
  {
    class: "board-container",
  }
);
