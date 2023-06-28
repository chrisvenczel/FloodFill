import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3001;

app.use(bodyParser.json());

// Calculate a flood fill on a canvas (like a bucket tool)
// x: number - x coordinate to start the fill
// y: number - y coordinate to start the fill
// color: string - color to fill with
// canvas: string[][] - 2d array of strings representing the canvas
// returns: string[][] - the new canvas
const floodFill = (x: number, y: number, color: string, canvas: string[][]) => {
  return [];
};

app.post("/flood_fill", (req, res) => {
  const { x, y, color, canvas } = req.body;
  console.log(x, y, color, canvas);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
