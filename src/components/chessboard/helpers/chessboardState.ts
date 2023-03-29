import {
  addListener,
  batchUpdate,
  createState,
} from "../../../../litState/src";
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
const startingLmf = new Array(64).fill(255);
const startingLmt = startingLmf.slice();

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
  lmf: startingLmf,
  lmt: startingLmt,
  rotated: false,
  computerPlaysLight: false,
  computerPlaysLightPrevVal: false,
  computerPlaysDarkPrevVal: false,
  computerPlaysDark: true,
  skipMoveAnimation: null as string | null,
  makeMove: (async (a, b) => {}) as (
    fen: string,
    options?: { dontAnimateMove?: boolean }
  ) => void,
});

chessboardState.makeMove = async (
  moveString: string,
  { dontAnimateMove } = {}
) => {
  const { fen, lmf, lmt } = await window.CHSS.mainWorker.do("getMovedFen", {
    moveString,
    fen: chessboardState.fen,
    lmf: Array.from(chessboardState.lmf),
    lmt: Array.from(chessboardState.lmt),
  });

  batchUpdate(() => {
    Object.assign(chessboardState, {
      fen,
      lmf,
      lmt,
      ...(dontAnimateMove ? { skipMoveAnimation: moveString } : {}),
    });
  });
};

const makeComputerMove = () => {
  const nextPiece = chessboardState.fen.split(" ")[1];

  if (
    (nextPiece === "b" && chessboardState.computerPlaysDark) ||
    (nextPiece === "w" && chessboardState.computerPlaysLight)
  ) {
    window.CHSS.mainWorker
      .do("getAiMovedFen", {
        fen: chessboardState.fen,
        lmf: Array.from(chessboardState.lmf),
        lmt: Array.from(chessboardState.lmt),
      })
      .then((result: { fen: string; lmf: number[]; lmt: number[] }) =>
        batchUpdate(() => Object.assign(chessboardState, result))
      );
  }
};

const animateAndUpdate = () => {
  animateBoardChanges(0.3, chessboardState.skipMoveAnimation).then(() => {
    batchUpdate(() => {
      Object.assign(chessboardState, {
        prevFen: chessboardState.fen,
        chessBoardUpdating: false,
        skipMoveAnimation: null,
      });
    });

    makeComputerMove();
  });
};

addListener(() => {
  if (
    chessboardState.computerPlaysLightPrevVal !==
      chessboardState.computerPlaysLight ||
    chessboardState.computerPlaysDarkPrevVal !==
      chessboardState.computerPlaysDark
  ) {
    batchUpdate(() => {
      chessboardState.computerPlaysDarkPrevVal =
        chessboardState.computerPlaysDark;
      chessboardState.computerPlaysLightPrevVal =
        chessboardState.computerPlaysLight;
    });

    makeComputerMove();
  }
}, "computerSideChanged");

addListener(() => {
  if (
    chessboardState.prevFen !== chessboardState.fen &&
    !chessboardState.chessBoardUpdating
  ) {
    batchUpdate(() =>
      Object.assign(chessboardState, {
        chessBoardUpdating: true,
        selectedCell: null,
        targetCells: [],
      })
    );

    animateAndUpdate();

    window.CHSS.mainWorker
      .do("getNextMoves", {
        fen: chessboardState.fen,
      })
      .then((nextMoves: string[]) => {
        const movableCells = getMovableCells(nextMoves);
        batchUpdate(() =>
          Object.assign(chessboardState, { nextMoves, movableCells })
        );
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
