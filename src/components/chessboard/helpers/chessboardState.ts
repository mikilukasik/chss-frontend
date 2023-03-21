import { addListener, createState } from "../../../../../../litState/lib";
import { fen2intArray } from "../../../../chss-module-engine/src/engine_new/transformers/fen2intArray";
import { move2moveString } from "../../../../chss-module-engine/src/engine_new/transformers/move2moveString";
import { generateLegalMoves } from "../../../../chss-module-engine/src/engine_new/moveGenerators/generateLegalMoves";
import { getMovedBoard } from "../../../../chss-module-engine/src/engine_new/utils/getMovedBoard";
import { moveString2move } from "../../../../chss-module-engine/src/engine_new/transformers/moveString2move";
import { board2fen } from "../../../../chss-module-engine/src/engine_new/transformers/board2fen";
import { animateBoardChanges } from "./animateBoardChanges";

const startingFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const getNextMoves = (bitBoard: Int8Array) =>
  Array.from(generateLegalMoves(bitBoard)).map(move2moveString);

const getMovableCells = (nextMoves: string[]) =>
  Object.keys(
    nextMoves.reduce((p, c) => {
      p[c.substring(0, 2)] = true;
      return p;
    }, {} as { [key: string]: true })
  );

const bitBoard = fen2intArray(startingFen);
const nextMoves = getNextMoves(bitBoard);
const movableCells = getMovableCells(nextMoves);

export const chessboardState = createState({
  fen: startingFen,
  prevFen: startingFen,
  bitBoard,
  nextMoves,
  movableCells,
  targetCells: {} as Record<string, true>,
  chessBoardUpdating: false,
  selectedCell: null as string | null,
  makeMove: ((a) => {}) as (fen: string) => void,
});

chessboardState.makeMove = (moveString: string) => {
  console.log("will move it");
  const move = moveString2move(moveString);
  const movedBoard = getMovedBoard(move, fen2intArray(chessboardState.fen));
  const movedFen = board2fen(movedBoard);
  console.log({ movedFen, movedBoard, move, b: chessboardState.bitBoard });
  chessboardState.fen = movedFen;
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

    const bitBoard = fen2intArray(chessboardState.fen);
    const nextMoves = getNextMoves(bitBoard);
    const movableCells = getMovableCells(nextMoves);

    Object.assign(chessboardState, { bitBoard, nextMoves, movableCells });
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
