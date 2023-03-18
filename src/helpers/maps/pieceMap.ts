export const pieceChars: Record<string, Record<string, string>> = {
  K: { char: "♔", class: "white-piece" },
  Q: { char: "♕", class: "white-piece" },
  R: { char: "♖", class: "white-piece" },
  B: { char: "♗", class: "white-piece" },
  N: { char: "♘", class: "white-piece" },
  P: { char: "♙", class: "white-piece" },
  k: { char: "♚", class: "black-piece" },
  q: { char: "♛", class: "black-piece" },
  r: { char: "♜", class: "black-piece" },
  b: { char: "♝", class: "black-piece" },
  n: { char: "♞", class: "black-piece" },
  p: { char: "♟︎", class: "black-piece" },
};

// ♔ ♚
// ♕ ♛
// ♖ ♜
// ♗ ♝
// ♘ ♞
// ♙ ♟︎

export const pieceFilenames: Record<string, string> = {
  K: "Chess_klt45.svg",
  Q: "Chess_qlt45.svg",
  R: "Chess_rlt45.svg",
  B: "Chess_blt45.svg",
  P: "Chess_plt45.svg",
  N: "Chess_nlt45.svg",
  k: "Chess_kdt45.svg",
  q: "Chess_qdt45.svg",
  r: "Chess_rdt45.svg",
  b: "Chess_bdt45.svg",
  n: "Chess_ndt45.svg",
  p: "Chess_pdt45.svg",
};

export const pieceNames: Record<string, string> = {
  K: "Light King",
  Q: "Light Queen",
  R: "Light Rook",
  B: "Light Bishop",
  P: "Light Pawn",
  N: "Light Knight",
  k: "Dark King",
  q: "Dark Queen",
  r: "Dark Rook",
  b: "Dark Bishop",
  n: "Dark Knight",
  p: "Dark Pawn",
};
