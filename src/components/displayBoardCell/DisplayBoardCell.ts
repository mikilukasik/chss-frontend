import "./displayBoardCell.scss";

import { component, html } from "../../../litState/src";
import { pieceFilenames, pieceNames } from "../../helpers/maps/pieceMap";
import { cellIndex2cellStr } from "../../../chss-module-engine/src/engine_new/transformers/cellIndex2cellStr.js";

const rotated = false;

export const BoardCellContent = component(
  ({ id, char, cellStr }) => {
    return char
      ? html`<img
          id="${id}-piece-svg-${cellStr}-${char}"
          class="piece-svg${rotated ? " upside-down" : ""}"
          src="assets/svg/${pieceFilenames[char]}"
          alt="${pieceNames[char]} on ${cellStr}"
        />`
      : "";
  },
  () => ({
    class: `cell-svg-container`,
  })
);

export const DisplayBoardCell = component(
  ({ id, index, char }) => {
    const cellStr = cellIndex2cellStr(index);

    return html`<div
      id="displayboard-square-${id}-${cellStr}"
      class="square ${(index + Math.floor(index / 8)) % 2 ? "black" : "white"}"
    >
      ${BoardCellContent({ cellStr, char })}
    </div> `;
  },
  { class: "square-wrapper" }
);
