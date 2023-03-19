import "./boardCell.scss";

import { component, handler, html } from "../../../../../litState/lib";
import { pieceFilenames, pieceNames } from "../../helpers/maps/pieceMap";
import { cellIndex2cellStr } from "../../../chss-module-engine/src/engine_new/transformers/cellIndex2cellStr.js";
import { chessboardState } from "../chessboard/chessboardState";

const highlightTargets = (cellStr: string): void => {
  const targets: [] = []; //getPossibleTargets(cellStr);
  const sourceCell = document.querySelector(`#board-square-${cellStr}`);
  if (sourceCell) {
    sourceCell.classList.add("selected");
  }

  targets.forEach((targetCellStr: string) => {
    const targetCell = document.querySelector(`#board-square-${targetCellStr}`);
    if (targetCell) {
      targetCell.classList.add("highlighted");
    }
  });
};

const removeHighlights = (): void => {
  const selectedCells = document.querySelectorAll(".selected, .highlighted");
  selectedCells.forEach((cell: Element) => {
    cell.classList.remove("selected", "highlighted");
  });
};

export const BoardCellContent = component(
  ({ char, cellStr }) => {
    return char
      ? html`<img
          class="piece-svg"
          src="assets/svg/${pieceFilenames[char]}"
          alt="${pieceNames[char]} on ${cellStr}"
        />`
      : "";
  },
  ({ cellStr, char }) => ({
    class: `cell-svg-container${char ? "" : " empty"}`,
    "data-square": cellStr,
  })
);

export const BoardCell = component(
  ({ index, char }) => {
    const cellStr = cellIndex2cellStr(index);

    const handleClick = handler(() => {
      if (chessboardState.selectedCell === cellStr) {
        chessboardState.selectedCell = null;
        removeHighlights();
      } else {
        chessboardState.selectedCell = cellStr;
        highlightTargets(cellStr);
      }
    });

    return html`<div
      id="board-square-${cellStr}"
      class="square ${(index + Math.floor(index / 8)) % 2 ? "black" : "white"}"
      onclick="${handleClick}"
    >
      ${BoardCellContent({ cellStr, char })}
    </div> `;
  },
  { class: "square-wrapper" }
);
