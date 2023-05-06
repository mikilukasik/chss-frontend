import { moveString2move } from "../../../../chss-module-engine/src/engine_new/transformers/moveString2move";
import {
  addListener,
  batchUpdate,
  createState,
} from "../../../../litState/src";
import { defaultStartingState } from "../../../helpers/constants/defaultStartingState";
import { addMove } from "../../../helpers/gameHelpers/addMove";
import { newGame } from "../../../helpers/gameHelpers/newGame";
import { animateBoardChanges } from "./animateBoardChanges";
import { processCompletedGame } from "../../../helpers/gameHelpers/processCompletedGame";

declare global {
  interface Window {
    CHSS: any;
  }
}

const defaultEngineConfig = {
  depth: 5,
  moveSorters: [{ cutoff: 0.01 }],
  moveScoreRario: 0.3,
  winnerScoreRario: 0.02,
};

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
      gameEnded: boolean;
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
  gameId: startingState.gameId as string | null,
  moveIndex: startingState.moveIndex,
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
  gameEnded: startingState.gameEnded,
  skipMoveAnimation: null as string | null,
  makeMove: (async (a, b) => {}) as (
    fen: string,
    options?: { dontAnimateMove?: boolean }
  ) => void,
  engineConfig: defaultEngineConfig,
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
    !chessboardState.gameEnded &&
    ((nextPiece === "b" && chessboardState.computerPlaysDark) ||
      (nextPiece === "w" && chessboardState.computerPlaysLight))
  ) {
    window.CHSS.mainWorker
      .do("getAiMovedFen", {
        fen: chessboardState.fen,
        lmf: Array.from(chessboardState.lmf),
        lmt: Array.from(chessboardState.lmt),
        gameId: chessboardState.gameId as string,
        moveIndex: chessboardState.moveIndex,
        engineConfig: JSON.parse(JSON.stringify(chessboardState.engineConfig)),
      })
      .then(
        (result: {
          fen: string;
          lmf: number[];
          lmt: number[];
          move: number;
          moveUpdateId: number;
        }) =>
          addMove({
            gameId: chessboardState.gameId as string,
            moveIndex: chessboardState.moveIndex,
            fen: chessboardState.fen,
            move: result.move,
            updateId: result.moveUpdateId,
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
      .then(
        ({
          nextMoves,
          gameEnded,
          result,
        }: {
          nextMoves: string[];
          gameEnded: boolean;
          result: number;
        }) => {
          chessboardState.gameEnded = gameEnded;
          const wNext = chessboardState.fen.split(" ")[1] === "w";
          const movableCells =
            wNext && chessboardState.computerPlaysLight
              ? []
              : !wNext && chessboardState.computerPlaysDark
              ? []
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
            gameEnded: chessboardState.gameEnded,
          };

          localStorage.setItem(
            "chessBoardState",
            JSON.stringify(dataToLocalStorage)
          );

          if (gameEnded) {
            processCompletedGame({ result });
          }
        }
      )
      .catch(console.error);
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
