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
const floodFill = (
  x: number,
  y: number,
  oldColor: string,
  newColor: string,
  canvas: string[][]
): string[][] => {
  if (x < 0 || y < 0 || x >= canvas.length || y >= canvas[0].length) {
    return canvas;
  }
  if (canvas[x][y] !== oldColor) {
    return canvas;
  }

  // Clone the canvas to avoid modifying the original array
  let newCanvas = JSON.parse(JSON.stringify(canvas));
  newCanvas[x][y] = newColor;

  newCanvas = floodFill(x + 1, y, oldColor, newColor, newCanvas);
  newCanvas = floodFill(x - 1, y, oldColor, newColor, newCanvas);
  newCanvas = floodFill(x, y + 1, oldColor, newColor, newCanvas);
  newCanvas = floodFill(x, y - 1, oldColor, newColor, newCanvas);

  return newCanvas;
};

app.post("/flood_fill", (req, res) => {
  const { x, y, color, canvas } = req.body;
  const newCanv = floodFill(x, y, canvas[x][y], color, canvas);
  console.log(newCanv);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
