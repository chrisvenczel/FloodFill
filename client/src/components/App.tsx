import styles from "../styles/App.module.css";
import axios from "axios";

function App() {
  return (
    <div className="App">
      <button
        className={styles.button}
        onClick={() => {
          axios
            .post("/flood_fill", {
              x: 1,
              y: 2,
              color: "red",
              canvas: [],
            })
            .then((response: any) => {
              console.log(response.data);
            })
            .catch((error: any) => {
              console.error("Request failed:", error);
            });
        }}
      >
        Generate
      </button>
    </div>
  );
}

export default App;
