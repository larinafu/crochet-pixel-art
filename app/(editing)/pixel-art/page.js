import PixelGridContainer from "@/components/pixelGridContainer/pixelGridContainer";
import { ToastContainer } from "react-toastify";

import styles from "./page.module.css";
import "react-toastify/dist/ReactToastify.css";

export default function PixelArtEditor() {
  return (
    <main className={styles.main}>
      {" "}
      <ToastContainer
        position="top-right"
        autoClose="3000"
      />
      <PixelGridContainer />
    </main>
  );
}
