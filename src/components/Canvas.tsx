import styles from "../styles/App.module.css";
import { useEffect, useRef, MutableRefObject } from "react";
import p5 from "p5";
import { GenSettings, randomNoiseVal } from "./App";
import "react-tooltip/dist/react-tooltip.css";
import { scanLineFill } from "../utils/floodFill";

interface Props {
  fillCol: MutableRefObject<string>;
  renderSettings: GenSettings;
}

const hexToRGB = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  return [r, g, b];
};

// Render the P5JS canvas
const sketch = (
  p: any,
  col1: string,
  col2: string,
  col3: string,
  width: number,
  height: number,
  fillCol: MutableRefObject<string>
) => {
  if (width === 0 || height === 0) return;
  p.setup = () => {
    p.createCanvas(width, height);
    p.noLoop();
    // Disable retina scaling
    p.pixelDensity(1);
  };

  // Generate a 'random' noise pattern
  // using the built in Perlin noise generator for P5JS
  p.draw = () => {
    const colors = [hexToRGB(col1), hexToRGB(col2), hexToRGB(col3)];

    const noiseScale = randomNoiseVal();
    // Load the current pixels of the canvas
    p.loadPixels();

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = 4 * (y * width + x);
        const noiseVal = p.noise(x * noiseScale, y * noiseScale);
        const colorIndex = Math.floor(noiseVal * colors.length);
        const [r, g, b] = colors[colorIndex];
        p.pixels[idx] = r;
        p.pixels[idx + 1] = g;
        p.pixels[idx + 2] = b;
        p.pixels[idx + 3] = 255;
      }
    }

    // Update the canvas with the new pixel data
    p.updatePixels();
  };

  p.mouseClicked = () => {
    const x = p.mouseX;
    const y = p.mouseY;
    if (x > 0 && y > 0 && x < p.width && y < p.height) {
      p.loadPixels();

      // Convert 1D pixels array into 2D array
      const canvasArray: [number, number, number][][] = [];
      for (let i = 0; i < p.height; i++) {
        const row: [number, number, number][] = [];
        for (let j = 0; j < p.width; j++) {
          const idx = 4 * (i * p.width + j);
          const r = p.pixels[idx];
          const g = p.pixels[idx + 1];
          const b = p.pixels[idx + 2];
          row.push([r, g, b]);
        }
        canvasArray.push(row);
      }

      const newCanv = scanLineFill(
        Math.floor(x),
        Math.floor(y),
        hexToRGB(fillCol.current),
        canvasArray
      );

      // Load the current pixels of the canvas
      p.loadPixels();

      // Iterate over the response data and update the pixels array
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = 4 * (y * width + x);
          const [r, g, b] = newCanv[y][x];
          p.pixels[idx] = r;
          p.pixels[idx + 1] = g;
          p.pixels[idx + 2] = b;
          p.pixels[idx + 3] = 255;
        }
      }

      // Update the canvas with the new pixel data
      p.updatePixels();
    }
  };
};

const Canvas = ({ renderSettings, fillCol }: Props) => {
  // The P5JS canvas
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<any>(null);

  // Update the canvas when the render settings change
  useEffect(() => {
    if (canvasRef.current === null) return;
    if (p5InstanceRef.current) p5InstanceRef.current.remove();
    p5InstanceRef.current = new p5(
      (p) =>
        sketch(
          p,
          renderSettings.col1,
          renderSettings.col2,
          renderSettings.col3,
          renderSettings.width,
          renderSettings.height,
          fillCol
        ),
      canvasRef.current
    );

    return () => p5InstanceRef.current.remove();
  }, [
    renderSettings.col1,
    renderSettings.col2,
    renderSettings.col3,
    renderSettings.width,
    renderSettings.height,
    renderSettings.randomNoiseVal,
    fillCol,
  ]);

  return (
    <div className={styles.canvasContainer}>
      <div
        style={{
          display:
            renderSettings.width === 0 || renderSettings.height === 0
              ? "none"
              : "block",
        }}
        className={styles.canvas}
        ref={canvasRef}
      ></div>
    </div>
  );
};

export default Canvas;
