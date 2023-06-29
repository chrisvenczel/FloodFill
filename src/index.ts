import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3001;

app.use(bodyParser.json({ limit: "50mb" }));

// Calculate a flood fill on a canvas (like a bucket tool)
// Using a modified version of the algorithm at chapter 4.10 from:
// https://theswissbay.ch/pdf/Gentoomen%20Library/Game%20Development/Programming/Graphics%20Gems%201.pdf
// This modified version includes diagonals as adjacent pixels
const scanLineFill = (
  startX: number,
  startY: number,
  newColor: [number, number, number],
  canvas: [number, number, number][][]
): [number, number, number][][] => {
  const oldColor = canvas[startY][startX];
  const height = canvas.length;
  const width = canvas[0].length;

  if (!colorsMatch(oldColor, newColor)) {
    const stack = [[startX, startY]];

    while (stack.length > 0) {
      const [x, y]: any = stack.pop();

      let west = x;
      let east = x;
      while (west >= 0 && colorsMatch(canvas[y][west], oldColor)) {
        west--;
      }
      while (east < width && colorsMatch(canvas[y][east], oldColor)) {
        east++;
      }

      for (let i = west + 1; i < east; i++) {
        canvas[y][i] = newColor;

        // Check all eight directions (including diagonals)
        if (y > 0 && colorsMatch(canvas[y - 1][i], oldColor)) {
          stack.push([i, y - 1]);
        }
        if (y < height - 1 && colorsMatch(canvas[y + 1][i], oldColor)) {
          stack.push([i, y + 1]);
        }
        if (i > 0 && colorsMatch(canvas[y][i - 1], oldColor)) {
          stack.push([i - 1, y]);
        }
        if (i < width - 1 && colorsMatch(canvas[y][i + 1], oldColor)) {
          stack.push([i + 1, y]);
        }
        if (y > 0 && i > 0 && colorsMatch(canvas[y - 1][i - 1], oldColor)) {
          stack.push([i - 1, y - 1]);
        }
        if (
          y > 0 &&
          i < width - 1 &&
          colorsMatch(canvas[y - 1][i + 1], oldColor)
        ) {
          stack.push([i + 1, y - 1]);
        }
        if (
          y < height - 1 &&
          i > 0 &&
          colorsMatch(canvas[y + 1][i - 1], oldColor)
        ) {
          stack.push([i - 1, y + 1]);
        }
        if (
          y < height - 1 &&
          i < width - 1 &&
          colorsMatch(canvas[y + 1][i + 1], oldColor)
        ) {
          stack.push([i + 1, y + 1]);
        }
      }
    }
  }

  return canvas;
};

const colorsMatch = (
  color1: [number, number, number],
  color2: [number, number, number]
): boolean => {
  return (
    color1[0] === color2[0] &&
    color1[1] === color2[1] &&
    color1[2] === color2[2]
  );
};

app.post("/flood_fill", (req, res) => {
  let { x, y, color, canvas } = req.body;
  x = Math.floor(x);
  y = Math.floor(y);
  const newCanv = scanLineFill(x, y, color, canvas);
  res.json(newCanv);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
