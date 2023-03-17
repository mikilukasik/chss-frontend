import { createState, component, html, mount } from "../../../litState/lib";
import "./chessboard.scss";

const state = createState({
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
});

const pieceMap: Record<string, string> = {
  K: "♔",
  Q: "♕",
  R: "♖",
  B: "♗",
  N: "♘",
  P: "♙",
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
};

export const Chessboard = component(() => {
  const rows = state.fen.split(" ")[0].split("/");
  let boardContent = "";

  for (let i = 0; i < 8; i++) {
    const row = rows[i];
    let col = 0;

    for (const char of row) {
      if (isNaN(parseInt(char))) {
        boardContent += html`<div
          class="square ${(i + col) % 2 ? "black" : "white"}"
        >
          ${pieceMap[char] || ""}
        </div>`;
        col++;
      } else {
        for (let j = 0; j < parseInt(char); j++) {
          boardContent += html`<div
            class="square ${(i + col) % 2 ? "black" : "white"}"
          ></div>`;
          col++;
        }
      }
    }
  }

  return html`<div class="board">${boardContent}</div>`;
});
