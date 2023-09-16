import "./displayBoard.scss";

import { component, html } from "../../../litState/src";
import { DisplayBoardCell } from "../displayBoardCell/DisplayBoardCell";

export const DisplayBoard = component(
  ({ id, fen, rotated }) => {
    const pureFen = fen.split(" ")[0].split("/").join("");
    let boardContent = "";

    let cellIndex = 0;
    for (const char of pureFen) {
      if (isNaN(parseInt(char))) {
        boardContent += DisplayBoardCell({
          index: cellIndex,
          char,
          id: `displayBoard-${id}-cell-${cellIndex}`,
        });
        cellIndex += 1;
        continue;
      }

      for (let j = 0; j < parseInt(char); j++) {
        boardContent += DisplayBoardCell({
          index: cellIndex,
          id: `displayBoard-${id}-cell-${cellIndex}`,
        });
        cellIndex += 1;
      }
    }

    return html`<div class="board${rotated ? " upside-down" : ""}">
      ${boardContent}
    </div>`;
  },
  {
    class: "board-container",
  }
);
