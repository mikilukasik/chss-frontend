import "./boardCell.scss";

import { component, handler, html } from "../../../litState/src";
import { pieceFilenames, pieceNames } from "../../helpers/maps/pieceMap";
import { cellIndex2cellStr } from "../../../chss-module-engine/src/engine_new/transformers/cellIndex2cellStr.js";
import { chessboardState } from "../chessboard/helpers/chessboardState";
import { CHSS } from "../../helpers/global";
import { isPromotionMove } from "../../helpers/utils/isPromotionMove";
import { renderModal } from "../modal/Modal";
import { PromotionSelectorModal } from "../promotionSelectorModal/PromotionSelectorModal";

let clearSelectionOnMouseRelease = false;

const moveSelectedTo = async (
  cellStr: string,
  { dontAnimateMove = false }: { dontAnimateMove?: boolean } = {}
) => {
  const move = chessboardState.selectedCell + cellStr;

  if (isPromotionMove(move, chessboardState.fen)) {
    const promotionPiece = await renderModal(
      (resolve) =>
        PromotionSelectorModal({
          resolve,
          pieces:
            chessboardState.fen.split(" ")[1] === "w"
              ? ["Q", "N", "R", "B"]
              : ["q", "n", "r", "b"],
        }),
      { allowClose: false }
    );

    const moveWithPromotion = move + promotionPiece.toLowerCase();
    chessboardState.makeMove(moveWithPromotion, { dontAnimateMove });
    return;
  }

  chessboardState.makeMove(move, { dontAnimateMove });
};

CHSS.handlers.cellDragStartHandler = async (
  cellStr: string,
  event: DragEvent
) => {
  if (chessboardState.movableCells.includes(cellStr)) {
    chessboardState.selectedCell = cellStr;
    clearSelectionOnMouseRelease = false;
  }
};

CHSS.handlers.cellDropHandler = async (cellStr: string) => {
  if (chessboardState.targetCells[cellStr]) {
    moveSelectedTo(cellStr, { dontAnimateMove: true });
  }
};

CHSS.handlers.cellClickHandler = async (cellStr: string) => {
  if (
    clearSelectionOnMouseRelease &&
    chessboardState.selectedCell === cellStr
  ) {
    chessboardState.selectedCell = null;
    clearSelectionOnMouseRelease = false;
  }
};

CHSS.handlers.cellMouseDownHandler = async (cellStr: string) => {
  if (chessboardState.movableCells.includes(cellStr)) {
    if (chessboardState.selectedCell === cellStr) {
      clearSelectionOnMouseRelease = true;
    }

    chessboardState.selectedCell = cellStr;
    return;
  }

  if (chessboardState.targetCells[cellStr]) {
    moveSelectedTo(cellStr);
    return;
  }

  if (chessboardState.selectedCell !== cellStr) {
    chessboardState.selectedCell = null;
    return;
  }
};

export const BoardCellContent = component(
  ({ char, cellStr }) => {
    return char
      ? html`<img
          id="piece-svg-${cellStr}-${char}"
          class="piece-svg${chessboardState.rotated ? " upside-down" : ""}"
          src="assets/svg/${pieceFilenames[char]}"
          alt="${pieceNames[char]} on ${cellStr}"
        />`
      : "";
  },
  ({ cellStr }) => ({
    class: `cell-svg-container${
      chessboardState.selectedCell === cellStr ? " selected" : ""
    }${chessboardState.targetCells[cellStr as string] ? " highlighted" : ""}`,
    "data-main-board-square": cellStr,
  })
);

export const BoardCell = component(
  ({ index, char }) => {
    const cellStr = cellIndex2cellStr(index);

    return html`<div
      id="data-main-board-square-${cellStr}"
      onmousedown="CHSS.handlers.cellMouseDownHandler('${cellStr}')"
      onclick="CHSS.handlers.cellClickHandler('${cellStr}')"
      ondragstart="CHSS.handlers.cellDragStartHandler('${cellStr}', event)"
      ondrop="CHSS.handlers.cellDropHandler('${cellStr}')"
      ondragover="event.preventDefault()"
      class="square ${(index + Math.floor(index / 8)) % 2 ? "black" : "white"}"
    >
      ${BoardCellContent({ cellStr, char })}
    </div> `;
  },
  { class: "square-wrapper" }
);
