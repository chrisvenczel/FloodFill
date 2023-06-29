import styles from "../styles/App.module.css";
import { useEffect, useRef } from "react";
import p5 from "p5";
import axios from "axios";
import { GenSettings, randomNoiseVal } from "./App";
import "react-tooltip/dist/react-tooltip.css";

const hexToRGB = (hex: string) => {
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
  height: number
) => {
  if (width === 0 || height === 0) return;
  p.setup = () => {
    p.createCanvas(width, height);
    p.noLoop();
  };

  // Generate a 'random' noise pattern
  // using the built in Perlin noise generator for P5JS
  p.draw = () => {
    const colors = [hexToRGB(col1), hexToRGB(col2), hexToRGB(col3)];

    const noiseScale = randomNoiseVal();
    for (let x = 0; x < p.width; x++) {
      for (let y = 0; y < p.height; y++) {
        const noiseVal = p.noise(x * noiseScale, y * noiseScale);
        const colorIndex = Math.floor(noiseVal * colors.length);
        p.stroke(colors[colorIndex]);
        p.point(x, y);
      }
    }
  };

  p.mouseClicked = () => {
    const x = p.mouseX;
    const y = p.mouseY;
    p.loadPixels();

    // Convert 1D pixels array into 2D array
    let canvasArray = [];
    for (let i = 0; i < p.height; i++) {
      let row = [];
      for (let j = 0; j < p.width; j++) {
        const idx = 4 * (i * p.width + j);
        const r = p.pixels[idx];
        const g = p.pixels[idx + 1];
        const b = p.pixels[idx + 2];
        const a = p.pixels[idx + 3];
        row.push([r, g, b, a]);
      }
      canvasArray.push(row);
    }

    // Make axios post request
    axios
      .post("/flood_fill", {
        x: x,
        y: y,
        color: "red",
        canvas: canvasArray,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Request failed:", error);
      });
  };
};

interface Props {
  renderSettings: GenSettings;
}

const Canvas = ({ renderSettings }: Props) => {
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
          renderSettings.height
        ),
      canvasRef.current
    );

    return () => p5InstanceRef.current.remove();
  }, [
    sketch,
    renderSettings.col1,
    renderSettings.col2,
    renderSettings.col3,
    renderSettings.width,
    renderSettings.height,
    renderSettings.randomNoiseVal,
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
