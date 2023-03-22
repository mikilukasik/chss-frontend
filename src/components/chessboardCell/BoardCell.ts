import "./boardCell.scss";

import { component, handler, html } from "../../../../../litState/lib";
import { pieceFilenames, pieceNames } from "../../helpers/maps/pieceMap";
import { cellIndex2cellStr } from "../../../chss-module-engine/src/engine_new/transformers/cellIndex2cellStr.js";
import { chessboardState } from "../chessboard/helpers/chessboardState";
import { CHSS } from "../../helpers/global";

CHSS.handlers.cellClickHandler = (cellStr: string) => {
  if (chessboardState.selectedCell === cellStr) {
    chessboardState.selectedCell = null;
  } else if (chessboardState.movableCells.includes(cellStr)) {
    chessboardState.selectedCell = cellStr;
  } else if (chessboardState.targetCells[cellStr]) {
    const move = chessboardState.selectedCell + cellStr;
    chessboardState.makeMove(move);
  }
};

export const BoardCellContent = component(
  ({ char, cellStr }) => {
    return char
      ? html`<img
          id="piece-svg-${cellStr}-${char}"
          class="piece-svg"
          src="assets/svg/${pieceFilenames[char]}"
          alt="${pieceNames[char]} on ${cellStr}"
        />`
      : "";
  },
  ({ cellStr }) => ({
    class: `cell-svg-container${
      chessboardState.selectedCell === cellStr ? " selected" : ""
    }${chessboardState.targetCells[cellStr as string] ? " highlighted" : ""}`,
    "data-square": cellStr,
  })
);

export const BoardCell = component(
  ({ index, char }) => {
    const cellStr = cellIndex2cellStr(index);

    return html`<div
      id="board-square-${cellStr}"
      onclick="CHSS.handlers.cellClickHandler('${cellStr}')"
      class="square ${(index + Math.floor(index / 8)) % 2 ? "black" : "white"}"
    >
      ${BoardCellContent(`board-cell-content-${cellStr}`, { cellStr, char })}
    </div> `;
  },
  { class: "square-wrapper" }
);
