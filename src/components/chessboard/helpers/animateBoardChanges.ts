import { getFenDiff } from "../../../../chss-module-engine/src/engine_new/utils/getFenDiff";
import { BoardCellContent } from "../../chessboardCell/BoardCell";
import { chessboardState } from "./chessboardState";

const getSquarePosition = (square: string) => {
  const col = square.charCodeAt(0) - 97;
  const row = 8 - parseInt(square.charAt(1));
  return false && chessboardState.rotated
    ? {
        x: (7 - col) * 100,
        y: (7 - row) * 100,
      }
    : {
        x: col * 100,
        y: row * 100,
      };
};

const getTranslationValues = (from: string, to: string) => {
  const fromPosition = getSquarePosition(from);
  const toPosition = getSquarePosition(to);
  return {
    x: toPosition.x - fromPosition.x,
    y: toPosition.y - fromPosition.y,
  };
};

export const animateBoardChanges = async (
  seconds: number = 0.5,
  moveToNotAnimate: string | null = null
): Promise<void> => {
  const board = document.querySelector(".main-board");
  if (!board) return;

  const {
    addedPieces,
    removedPieces,
    movedPieces,
    promotionMove,
  }: {
    addedPieces: { square: string; piece: string }[];
    removedPieces: { square: string; piece: string }[];
    movedPieces: { from: string; to: string; piece: string }[];
    promotionMove: { from: string; to: string; piece: string } | null;
  } = getFenDiff(chessboardState.prevFen, chessboardState.fen);

  // Animate removed pieces
  removedPieces.forEach(({ square }) => {
    const piece = board.querySelector(
      `[data-main-board-square="${square}"]`
    ) as HTMLElement;

    piece.style.transition = `transform ${seconds}s ease-out`;
    piece.style.transform = "scale(0)";

    piece.addEventListener("transitionend", () => {});
  });

  // Animate moved pieces
  movedPieces.forEach(({ piece, from, to }) => {
    const pieceElement = board.querySelector(
      `[data-main-board-square="${from}"]`
    ) as HTMLElement;
    const translation = getTranslationValues(from, to);

    if (
      !moveToNotAnimate ||
      !(
        moveToNotAnimate.substring(0, 2) === from &&
        moveToNotAnimate.substring(2, 4) === to
      )
    ) {
      pieceElement.style.transition = `transform ${seconds}s ease-out`;
    }

    pieceElement.style.zIndex = "1";
    pieceElement.style.transform = `translate(${translation.x}%, ${translation.y}%)`;
    pieceElement.style.transformOrigin = "0 0";

    pieceElement.addEventListener("transitionend", () => {});
  });

  // Animate promotion move
  if (promotionMove) {
    const { piece, from, to } = promotionMove;

    const pawnElement = board.querySelector(
      `[data-main-board-square="${from}"]`
    ) as HTMLElement;
    const translation = getTranslationValues(from, to);

    pawnElement.style.zIndex = "1";
    pawnElement.style.transition = `all ${seconds}s ease-out`;
    pawnElement.style.transform = `translate(${translation.x}%, ${translation.y}%)`;
    pawnElement.style.opacity = "0";
    pawnElement.style.transformOrigin = "0 0";

    pawnElement.addEventListener("transitionend", () => {});

    const parser = new DOMParser();
    const doc = parser.parseFromString(
      `<body>${BoardCellContent({
        char: piece,
        cellStr: from,
        id: `board-cell-content-${from}-temp`,
      })}</body>`,
      "text/html"
    );
    const promotedPieceElement = doc.body.firstElementChild as HTMLElement;

    promotedPieceElement.style.opacity = "0";
    promotedPieceElement.style.zIndex = "1";

    const container = document.getElementById(
      `main-board-square-${from}`
    ) as HTMLElement;

    container.appendChild(promotedPieceElement);
    promotedPieceElement.style.transition = `all ${seconds}s ease-out`;

    setTimeout(() => {
      // promotedPieceElement.style.transition = `all ${seconds}s ease-out`;
      promotedPieceElement.style.opacity = `1`;
      promotedPieceElement.style.transform = `translate(${translation.x}%, ${translation.y}%)`;

      promotedPieceElement.style.transformOrigin = "0 0";

      promotedPieceElement.addEventListener("transitionend", () => {});
    }, 0);
  }

  // Animate added pieces
  addedPieces.forEach(({ piece, square }) => {
    const pieceElement = document.createElement("div");
    pieceElement.innerHTML = BoardCellContent({
      char: piece,
      cellStr: square,
      id: `board-cell-content-${square}-temp`,
    });
    pieceElement.style.transform = "scale(0)";

    const container = document.getElementById(
      `main-board-square-${square}`
    ) as HTMLElement;

    container.appendChild(pieceElement);
    setTimeout(() => {
      pieceElement.style.transition = `transform ${seconds}s ease-out`;
      pieceElement.style.transform = `scale(1)`;

      pieceElement.addEventListener("transitionend", () => {});
    }, 0);
  });

  return new Promise((r) => setTimeout(r, seconds * 1000));
};
