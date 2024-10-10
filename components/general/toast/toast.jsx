import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import styles from "./toast.module.css";

export default function Toast({ isDisplayed, children }) {
  const [mouseOver, setMouseOver] = useState(false);
  return (
    <AnimatePresence>
      {isDisplayed && (
        <motion.div
          className={`detailContainer ${styles.container} ${
            isDisplayed ? "" : styles.hidden
          }`}
          initial={{ opacity: 0, y: "-50%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
