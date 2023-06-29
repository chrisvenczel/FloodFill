import styles from "../styles/App.module.css";
import { useState } from "react";
import "react-tooltip/dist/react-tooltip.css";
import Canvas from "./Canvas";
import Controls from "./Controls";

export interface GenSettings {
  // Colors stored in hex format
  col1: string;
  col2: string;
  col3: string;

  // Perlin noise value
  randomNoiseVal: number;

  height: number;
  width: number;
}

const randomHexColor = (): string => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  const randomHexColor = `#${randomColor.padStart(6, "0")}`;

  return randomHexColor;
};

export const randomNoiseVal = (): number => {
  const max = 0.3;
  const min = 0.001;
  return Math.random() * (max - min) + min;
};

const initState: GenSettings = {
  col1: randomHexColor(),
  col2: randomHexColor(),
  col3: randomHexColor(),
  randomNoiseVal: randomNoiseVal(),
  height: 500,
  width: 500,
};

const App = () => {
  // The settings controlling the current render
  // Updated when "Generate" button is clicked
  const [renderSettings, setRenderSettings] = useState<GenSettings>(initState);

  // Bucket tool color (stored as hex string)
  const [fillCol, setFillCol] = useState<string>(randomHexColor());

  return (
    <>
      <Controls
        initState={initState}
        fillCol={fillCol}
        setFillCol={setFillCol}
        setRenderSettings={setRenderSettings}
      />
      <div className={styles.centerBox}>
        <Canvas renderSettings={renderSettings} />
      </div>
    </>
  );
};

export default App;
