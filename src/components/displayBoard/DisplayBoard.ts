import "./displayBoard.scss";

import { component, html } from "../../../litState/src";
import { DisplayBoardCell } from "../displayBoardCell/DisplayBoardCell";
import { BoardArrows } from "../boardArrows/BoardArrows";
import { cellIndex2cellStr } from "../../../chss-module-engine/src/engine_new/transformers/moveString2move";

export const DisplayBoard = component(
  ({ id, fen, rotated, moves }) => {
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

    const getCell = (cellIndex: number) => {
      const cellStr = cellIndex2cellStr(cellIndex);
      return document.getElementById(
        `displayboard-square-displayBoard-${id}-cell-${cellIndex}-${cellStr}`
      )?.parentElement;
    };

    return html`
      ${BoardArrows({ moves, getCell })}
      <div class="board${rotated ? " upside-down" : ""}">${boardContent}</div>
    `;
  },
  {
    class: "board-container",
  }
);
