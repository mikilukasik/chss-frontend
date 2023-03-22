import { addListener, createState } from "../../../../../../litState/lib";
import { animateBoardChanges } from "./animateBoardChanges";

const startingFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const startingMoves = [
  "g1f3",
  "g1h3",
  "b1a3",
  "b1c3",
  "h2h3",
  "h2h4",
  "g2g3",
  "g2g4",
  "f2f3",
  "f2f4",
  "e2e3",
  "e2e4",
  "d2d3",
  "d2d4",
  "c2c3",
  "c2c4",
  "b2b3",
  "b2b4",
  "a2a3",
  "a2a4",
];

declare global {
  interface Window {
    CHSS: any;
  }
}

const getMovableCells = (nextMoves: string[]) =>
  Object.keys(
    nextMoves.reduce((p, c) => {
      p[c.substring(0, 2)] = true;
      return p;
    }, {} as { [key: string]: true })
  );

const movableCells = getMovableCells(startingMoves);

export const chessboardState = createState({
  fen: startingFen,
  prevFen: startingFen,
  nextMoves: startingMoves,
  movableCells,
  targetCells: {} as Record<string, true>,
  chessBoardUpdating: false,
  selectedCell: null as string | null,
  makeMove: (async (a) => {}) as (fen: string) => void,
});

chessboardState.makeMove = async (moveString: string) => {
  chessboardState.fen = await window.CHSS.mainWorker.do("getMovedFen", {
    moveString,
    fen: chessboardState.fen,
  });
};

addListener(() => {
  if (
    chessboardState.prevFen !== chessboardState.fen &&
    !chessboardState.chessBoardUpdating
  ) {
    Object.assign(chessboardState, {
      chessBoardUpdating: true,
      selectedCell: null,
      targetCells: [],
    });

    animateBoardChanges(0.3).then(() => {
      Object.assign(chessboardState, {
        prevFen: chessboardState.fen,
        chessBoardUpdating: false,
      });
    });

    window.CHSS.mainWorker
      .do("getNextMoves", {
        fen: chessboardState.fen,
      })
      .then((nextMoves: string[]) => {
        const movableCells = getMovableCells(nextMoves);
        Object.assign(chessboardState, { nextMoves, movableCells });
      });
  }
}, "fen-update-listener");

addListener(() => {
  if (
    !chessboardState.selectedCell ||
    !chessboardState.nextMoves ||
    chessboardState.nextMoves.length === 0
  ) {
    chessboardState.targetCells = {};
    return;
  }

  chessboardState.targetCells = chessboardState.nextMoves.reduce(
    (p, nextMove) => {
      if (nextMove.startsWith(chessboardState.selectedCell as string))
        p[nextMove.substring(2, 4)] = true;
      return p;
    },
    {} as Record<string, true>
  );
}, "selected-cell-listener");
