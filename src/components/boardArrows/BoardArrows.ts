import { component, html } from "../../../litState/src";
import "./boardArrows.scss";

export const BoardArrows = component(
  ({
    id,
    moves = [] as { move: number; moveString: string; score: number }[],
    getCell,
  }) => {
    const clearCanvas = () => {
      const canvas = document.getElementById(
        `chessboard-canvas-${id}`
      ) as HTMLCanvasElement | null;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      context.clearRect(0, 0, canvas.width, canvas.height);
    };

    const drawArrow = (
      startX: number,
      startY: number,
      endX: number,
      endY: number,
      color: string,
      opacity: number,
      score: number
    ) => {
      const canvas = document.getElementById(
        `chessboard-canvas-${id}`
      ) as HTMLCanvasElement | null;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      // set arrow color, opacity, and line width
      const lineWidth = 20 * opacity;

      context.strokeStyle = color;
      context.fillStyle = color;
      context.lineWidth = lineWidth;
      context.globalAlpha = opacity;

      const angle = Math.atan2(endY - startY, endX - startX);

      const endXAdjusted = endX - lineWidth * 2 * Math.cos(angle);
      const endYAdjusted = endY - lineWidth * 2 * Math.sin(angle);

      // draw arrow line
      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(endXAdjusted, endYAdjusted);
      context.stroke();

      // draw arrow head
      context.save();
      context.translate(endX, endY);
      context.rotate(angle);
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(-lineWidth * 2, -lineWidth * 2);
      context.lineTo(-lineWidth * 2, lineWidth * 2);
      context.closePath();
      context.fill();
      context.restore();

      // Calculate midpoint for score and adjust it slightly
      const midpointX = (startX + endXAdjusted) / 2;
      const midpointY = (startY + endYAdjusted) / 2;

      // Set the score color to a contrasting one (white in this case)
      context.fillStyle = "white";
      context.strokeStyle = "black"; // Add a stroke to increase readability
      context.lineWidth = 2; // Adjust based on preference

      // Rotate text to align with the arrow line
      context.save();
      context.translate(midpointX, midpointY);
      context.rotate(angle);

      context.font = `${lineWidth}px Arial`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(score.toFixed(4), 0, 0);
      context.strokeText(score.toFixed(4), 0, 0); // This will outline the text to make it more readable

      context.restore();
    };

    const scoreSum = moves.reduce(
      (
        sum: number,
        move: { move: number; moveString: string; score: number }
      ) => sum + move.score,
      0
    );

    setTimeout(() => {
      clearCanvas();

      const canvas = document.getElementById(
        `chessboard-canvas-${id}`
      ) as HTMLCanvasElement | null;
      if (!canvas) return;
      const container = canvas.parentElement?.parentElement;
      if (!container) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      for (const move of moves) {
        const startCell = getCell(move.move >>> 10);
        const endCell = getCell(move.move & 63);

        const opacity = move.score / scoreSum;
        const color = `#00${Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, "0")}00`;

        const startX = startCell.offsetLeft + startCell.offsetWidth / 2;
        const startY = startCell.offsetTop + startCell.offsetHeight / 2;
        const endX = endCell.offsetLeft + endCell.offsetWidth / 2;
        const endY = endCell.offsetTop + endCell.offsetHeight / 2;

        drawArrow(startX, startY, endX, endY, color, opacity, move.score);
      }
    }, 0);

    return html`<canvas
      id="chessboard-canvas-${id}"
      class="chessboard-canvas"
    ></canvas>`;
  }
);
