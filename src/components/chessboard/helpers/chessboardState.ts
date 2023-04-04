import { moveString2move } from "../../../../chss-module-engine/src/engine_new/transformers/moveString2move";
import {
  addListener,
  batchUpdate,
  createState,
} from "../../../../litState/src";
import { defaultStartingState } from "../../../helpers/constants/defaultStartingState";
import { addMove } from "../../../helpers/gameHelpers/addMove";
import { newGame } from "../../leftBar/helpers/newGame";
import { animateBoardChanges } from "./animateBoardChanges";

declare global {
  interface Window {
    CHSS: any;
  }
}

const lastRememberedState = localStorage.getItem("chessBoardState");
if (!lastRememberedState) setTimeout(newGame, 0);

const startingState = lastRememberedState
  ? (JSON.parse(lastRememberedState) as {
      fen: string;
      gameId: string;
      moveIndex: number;
      nextMoves: string[];
      lmf: number[];
      lmt: number[];
      rotated: boolean;
      computerPlaysDark: boolean;
      computerPlaysLight: boolean;
    })
  : defaultStartingState;

const getMovableCells = (nextMoves: string[]) =>
  Object.keys(
    nextMoves.reduce((p, c) => {
      p[c.substring(0, 2)] = true;
      return p;
    }, {} as { [key: string]: true })
  );

const movableCells = getMovableCells(startingState.nextMoves);

export const chessboardState = createState({
  gameId: null as string | null,
  moveIndex: 0,
  fen: startingState.fen,
  prevFen: startingState.fen,
  nextMoves: startingState.nextMoves,
  movableCells,
  targetCells: {} as Record<string, true>,
  chessBoardUpdating: false,
  selectedCell: null as string | null,
  lmf: startingState.lmf,
  lmt: startingState.lmt,
  rotated: startingState.rotated,
  computerPlaysLight: startingState.computerPlaysLight,
  computerPlaysLightPrevVal: false,
  computerPlaysDarkPrevVal: false,
  computerPlaysDark: startingState.computerPlaysDark,
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

  addMove({
    gameId: chessboardState.gameId as string,
    moveIndex: chessboardState.moveIndex,
    fen: chessboardState.fen,
    move: moveString2move(moveString),
  })
    .then(() => {
      batchUpdate(() => {
        Object.assign(chessboardState, {
          fen,
          lmf,
          lmt,
          ...(dontAnimateMove ? { skipMoveAnimation: moveString } : {}),
        });

        chessboardState.moveIndex += 1;
      });
    })
    .catch(console.error);
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
      .then(
        (result: { fen: string; lmf: number[]; lmt: number[]; move: number }) =>
          addMove({
            gameId: chessboardState.gameId as string,
            moveIndex: chessboardState.moveIndex,
            fen: chessboardState.fen,
            move: result.move,
          }).then(() => result)
      )
      .then(
        (result: { fen: string; lmf: number[]; lmt: number[]; move: number }) =>
          batchUpdate(() => {
            Object.assign(chessboardState, result);
            chessboardState.moveIndex += 1;
          })
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

    setTimeout(makeComputerMove, 500);
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
        const wNext = chessboardState.fen.split(" ")[1] === "w";
        const movableCells =
          wNext && chessboardState.computerPlaysLight
            ? {}
            : !wNext && chessboardState.computerPlaysDark
            ? {}
            : getMovableCells(nextMoves);
        batchUpdate(() =>
          Object.assign(chessboardState, { nextMoves, movableCells })
        );

        const dataToLocalStorage = {
          fen: chessboardState.fen,
          gameId: chessboardState.gameId,
          moveIndex: chessboardState.moveIndex,
          nextMoves: chessboardState.nextMoves,
          lmf: chessboardState.lmf,
          lmt: chessboardState.lmt,
          rotated: chessboardState.rotated,
          computerPlaysLight: chessboardState.computerPlaysLight,
          computerPlaysDark: chessboardState.computerPlaysDark,
        };

        localStorage.setItem(
          "chessBoardState",
          JSON.stringify(dataToLocalStorage)
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
