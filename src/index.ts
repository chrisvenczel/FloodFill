import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3001;

app.use(bodyParser.json({ limit: "50mb" }));

// Calculate a flood fill on a canvas (like a bucket tool)
// x: number - x coordinate to start the fill
// y: number - y coordinate to start the fill
// color: string - color to fill with
// canvas: string[][] - 2d array of strings representing the canvas
// returns: string[][] - the new canvas
/*const floodFill = (
  x: number,
  y: number,
  oldColor: string,
  newColor: string,
  canvas: string[][]
): string[][] => {
  console.log(x, y);
  if (x < 0 || y < 0 || x >= canvas.length || y >= canvas[0].length) {
    return canvas;
  }
  if (canvas[x][y] !== oldColor) {
    return canvas;
  }
  console.log("hello");

  // Clone the canvas to avoid modifying the original array
  let newCanvas = JSON.parse(JSON.stringify(canvas));
  newCanvas[x][y] = newColor;

  newCanvas = floodFill(x + 1, y, oldColor, newColor, newCanvas);
  newCanvas = floodFill(x - 1, y, oldColor, newColor, newCanvas);
  newCanvas = floodFill(x, y + 1, oldColor, newColor, newCanvas);
  newCanvas = floodFill(x, y - 1, oldColor, newColor, newCanvas);

  return newCanvas;
};*/

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
        if (y > 0 && colorsMatch(canvas[y - 1][i], oldColor)) {
          stack.push([i, y - 1]);
        }
        if (y < height - 1 && colorsMatch(canvas[y + 1][i], oldColor)) {
          stack.push([i, y + 1]);
        }
      }
    }
  }

  return canvas;
};

const floodFill = (
  startX: number,
  startY: number,
  newColor: [number, number, number],
  canvas: [number, number, number][][]
): [number, number, number][][] => {
  const oldColor = canvas[startY][startX];
  const stack = [[startX, startY]];

  while (stack.length > 0) {
    const [x, y]: any = stack.pop();
    if (x >= 0 && y >= 0 && x < canvas[0].length && y < canvas.length) {
      if (colorsMatch(canvas[y][x], oldColor)) {
        canvas[y][x] = newColor;
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
        stack.push([x - 1, y]);
        stack.push([x + 1, y]);
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
