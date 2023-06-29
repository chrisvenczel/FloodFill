import styles from "../styles/App.module.css";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import { ChangeEvent, useState } from "react";
import { GenSettings, randomNoiseVal } from "./App";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

// Remove any non-digit characters
const restrictToNums = (rawVal: string): number => {
  const cleanVal = parseInt(rawVal.replace(/\D/g, ""));
  return cleanVal ? cleanVal : 0;
};

const TextInput = ({
  val,
  setVal,
}: {
  val: number;
  setVal: (val: number) => void;
}) => {
  return (
    <input
      maxLength={3}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        setVal(restrictToNums(e.target.value))
      }
      value={val}
      type="text"
      className={styles.input}
    />
  );
};

const ColorInput = ({
  val,
  setVal,
}: {
  val: string;
  setVal: (val: string) => void;
}) => {
  return (
    <input
      onChange={(e: ChangeEvent<HTMLInputElement>) => setVal(e.target.value)}
      style={{ backgroundColor: val }}
      value={val}
      type="color"
      className={`${styles.input} ${styles.color}`}
    />
  );
};

const Info = ({ msg }: { msg: string }) => {
  return (
    <i
      data-tooltip-id="tooltip"
      data-tooltip-content={msg}
      className={styles.info}
    >
      ?
    </i>
  );
};

const AboutPopup = () => {
  return (
    <Popup
      trigger={<div className={`${styles.aboutLink}`}>What is this?</div>}
      modal
    >
      <div className={styles.aboutModal}>
        <p>
          This web page implements a flood fill algorithm such as those used in
          MS Paint and Photoshop. Begin by generating a random image of{" "}
          <a
            target="_blank"
            href="https://en.wikipedia.org/wiki/Perlin_noise#:~:text=Perlin%20noise%20is%20a%20type,the%20creation%20of%20image%20textures."
          >
            Perlin noise
          </a>{" "}
          by adjusting the color and canvas size options and then clicking
          "Generate". Then click on the canvas to fill the area with the
          selected fill color.
        </p>
        <p>
          The algorithm implemented is based on the one described{" "}
          <a
            target="_blank"
            href="https://theswissbay.ch/pdf/Gentoomen%20Library/Game%20Development/Programming/Graphics%20Gems%201.pdf"
          >
            here (page 296)
          </a>
          . It has been slightly modified in order to consider diagonal pixels
          as adjacent.
        </p>
      </div>
    </Popup>
  );
};

interface Props {
  fillCol: string;
  setFillCol: React.Dispatch<React.SetStateAction<string>>;
  setRenderSettings: React.Dispatch<React.SetStateAction<GenSettings>>;
  initState: GenSettings;
}

const Controls = ({
  fillCol,
  setFillCol,
  initState,
  setRenderSettings,
}: Props) => {
  // The controls on the left side of the screen
  const [genSettings, setGenSettings] = useState<GenSettings>(initState);

  return (
    <div className={styles.controlsContainer}>
      <Tooltip id="tooltip" />
      {/* Title & About */}
      <div className={styles.titleContainer}>
        <div className={`${styles.title}`}>Flood Filler</div>
        <AboutPopup />
      </div>

      {/* Fill Color */}
      <div className={`${styles.controlBox}`}>
        <div style={{ marginBottom: 0 }} className={styles.inputContainer}>
          <div className={styles.inputTitle}>
            <span>Fill Color</span>
            <Info
              msg={"The color to be used for the flood fill / bucket tool"}
            />
          </div>
          <ColorInput val={fillCol} setVal={setFillCol} />
        </div>
      </div>

      <div style={{ marginBottom: 0 }} className={`${styles.controlBox}`}>
        {/* Generation Colors */}
        <div className={styles.inputContainer}>
          <div className={styles.inputTitle}>
            <span>Colors</span>
            <Info msg={"Pick three colors to use in the random generation"} />
          </div>
          <ColorInput
            val={genSettings.col1}
            setVal={(e) => setGenSettings({ ...genSettings, col1: e })}
          />
          <ColorInput
            val={genSettings.col2}
            setVal={(e) => setGenSettings({ ...genSettings, col2: e })}
          />
          <ColorInput
            val={genSettings.col3}
            setVal={(e) => setGenSettings({ ...genSettings, col3: e })}
          />
        </div>

        {/* Height & Width */}
        <div className={styles.inputContainer}>
          <div className={styles.inputTitle}>
            <span>Height (px)</span>
            <Info msg={"The canvas height (max: 999)"} />
          </div>
          <TextInput
            val={genSettings.height}
            setVal={(e) => setGenSettings({ ...genSettings, height: e })}
          />
        </div>
        <div className={styles.inputContainer}>
          <div className={styles.inputTitle}>
            <span>Width (px)</span>
            <Info msg={"The canvas width (max: 999)"} />
          </div>
          <TextInput
            val={genSettings.width}
            setVal={(e) => setGenSettings({ ...genSettings, width: e })}
          />
        </div>

        {/* Generate Button */}
        <div
          onClick={() => {
            setRenderSettings({
              ...genSettings,
              randomNoiseVal: randomNoiseVal(),
            });
          }}
          className={styles.generateBtn}
        >
          Generate
        </div>
      </div>
    </div>
  );
};

export default Controls;
