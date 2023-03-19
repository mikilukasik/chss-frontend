import { addListener, createState } from "../../../../../litState/lib";
import { animateBoardChanges } from "./helpers/animateBoardChanges";

export const chessboardState = createState({
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  prevFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  selectedCell: null,
} as {
  fen: string;
  prevFen: string;
  selectedCell: string | null;
});

addListener(() => {
  if (chessboardState.prevFen !== chessboardState.fen) {
    animateBoardChanges().then(
      () => (chessboardState.prevFen = chessboardState.fen)
    );
  }
});
