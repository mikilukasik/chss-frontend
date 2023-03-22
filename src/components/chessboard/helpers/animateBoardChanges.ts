import { getFenDiff } from "../../../../chss-module-engine/src/engine_new/utils/getFenDiff";
import { BoardCellContent } from "../../chessboardCell/BoardCell";
import { chessboardState } from "./chessboardState";

export const animateBoardChanges = async (
  seconds: number = 0.5
): Promise<void> => {
  const board = document.querySelector(".board");
  if (!board) return;

  const { addedPieces, removedPieces, movedPieces } = getFenDiff(
    chessboardState.prevFen,
    chessboardState.fen
  );

  // Animate removed pieces
  removedPieces.forEach(({ square }) => {
    const piece = board.querySelector(
      `[data-square="${square}"]`
    ) as HTMLElement;

    piece.style.transition = `transform ${seconds}s ease-out`;
    piece.style.transform = "scale(0)";

    piece.addEventListener("transitionend", () => {});
  });

  // Animate moved pieces
  movedPieces.forEach(({ piece, from, to }) => {
    const pieceElement = board.querySelector(
      `[data-square="${from}"]`
    ) as HTMLElement;
    const translation = getTranslationValues(from, to);

    pieceElement.style.zIndex = "1";
    pieceElement.style.transition = `transform ${seconds}s ease-out`;
    pieceElement.style.transform = `translate(${translation.x}%, ${translation.y}%)`;
    pieceElement.style.transformOrigin = "0 0";

    pieceElement.addEventListener("transitionend", () => {});
  });

  function getSquarePosition(square: string) {
    const col = square.charCodeAt(0) - 97;
    const row = 8 - parseInt(square.charAt(1));
    return {
      x: col * 100,
      y: row * 100,
    };
  }

  function getTranslationValues(from: string, to: string) {
    const fromPosition = getSquarePosition(from);
    const toPosition = getSquarePosition(to);
    return {
      x: toPosition.x - fromPosition.x,
      y: toPosition.y - fromPosition.y,
    };
  }

  // Animate added pieces
  addedPieces.forEach(({ piece, square }) => {
    const pieceElement = document.createElement("div");
    pieceElement.innerHTML = BoardCellContent(
      `board-cell-content-${square}-temp`,
      {
        char: piece,
        cellStr: square,
      }
    );
    pieceElement.style.transform = "scale(0)";

    const container = document.getElementById(
      `board-square-${square}`
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
