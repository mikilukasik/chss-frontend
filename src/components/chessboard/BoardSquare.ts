import { component, html } from "../../../../../litState/lib";
import { pieceMap } from "../../helpers/maps/pieceMap";
import "./boardSquare.scss";
import { cellIndex2cellStr } from "../../../chss-module-engine/src/engine_new/transformers/cellIndex2cellStr.js";

export const BoardSquare = component(
  ({ index, char }) => {
    return html`<div
      id="board-square-${cellIndex2cellStr(index)}"
      class="square ${(index + Math.floor(index / 8)) % 2
        ? "black"
        : "white"} ${char ? pieceMap[char].class : ""}"
    >
      ${char ? pieceMap[char].char : ""}
    </div> `;
  },
  { class: "square-wrapper" }
);
