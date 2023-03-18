import { component, html } from "../../../../../litState/lib";
import { pieceFilenames, pieceNames } from "../../helpers/maps/pieceMap";
import "./boardSquare.scss";
import { cellIndex2cellStr } from "../../../chss-module-engine/src/engine_new/transformers/cellIndex2cellStr.js";

export const BoardSquare = component(
  ({ index, char }) => {
    const cellStr = cellIndex2cellStr(index);
    return html`<div
      id="board-square-${cellStr}"
      class="square ${(index + Math.floor(index / 8)) % 2 ? "black" : "white"}"
    >
      ${char
        ? `<img
        class="piece-svg"
        src="assets/svg/${pieceFilenames[char]}"
        alt="${pieceNames[char]} on ${cellStr}"
      />`
        : ""}
    </div> `;
  },
  { class: "square-wrapper" }
);
