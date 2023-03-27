import { expandFenRow } from "../../../chss-module-engine/src/engine_new/transformers/expandFenRow";

export const isPromotionMove = (moveString: string, fen: string) => {
  if (
    !(moveString[1] === "2" && moveString[3] === "1") &&
    !(moveString[1] === "7" && moveString[3] === "8")
  )
    return false;

  const sourceRankIndex = 8 - parseInt(moveString[1]);
  const rowStr = fen.split(" ")[0].split("/")[sourceRankIndex];
  const expandedRowStr = expandFenRow(rowStr);

  const sourceFileIndex = moveString.charCodeAt(0) - 97;
  const sourcePiece = expandedRowStr[sourceFileIndex];

  return sourcePiece.toLowerCase() === "p";
};
