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
      opacity: number
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
      context.fillStyle = color; // set fill color to match stroke color
      context.lineWidth = lineWidth;

      context.globalAlpha = opacity;

      // calculate arrow angle and length
      const angle = Math.atan2(endY - startY, endX - startX);
      const length = Math.sqrt((endY - startY) ** 2 + (endX - startX) ** 2);

      // draw arrow line
      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(endX, endY);
      context.stroke();

      // calculate x and y components of offset based on arrow direction
      const offsetX = 2 * lineWidth * Math.cos(angle);
      const offsetY = 2 * lineWidth * Math.sin(angle);

      context.fillStyle = `rgba(${color}, ${opacity})`;

      // draw arrow head
      context.save();
      context.translate(endX + offsetX, endY + offsetY);
      context.rotate(angle);
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(-lineWidth * 2, -lineWidth * 2);
      context.lineTo(-lineWidth * 2, lineWidth * 2);
      context.closePath();
      context.fill();
      context.restore();
    };

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

        const opacity = Math.max(0, Math.min(1, move.score));
        const color = `#00${Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, "0")}00`;

        const startX = startCell.offsetLeft + startCell.offsetWidth / 2;
        const startY = startCell.offsetTop + startCell.offsetHeight / 2;
        const endX = endCell.offsetLeft + endCell.offsetWidth / 2;
        const endY = endCell.offsetTop + endCell.offsetHeight / 2;

        drawArrow(startX, startY, endX, endY, color, opacity);
      }
    }, 0);

    return html`<canvas
      id="chessboard-canvas-${id}"
      class="chessboard-canvas"
    ></canvas>`;
  }
);
