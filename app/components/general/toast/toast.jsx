import { AnimatePresence, motion } from "framer-motion";

import styles from "./toast.module.css";

export default function Toast({ isDisplayed, children }) {
  return (
    <AnimatePresence>
      {isDisplayed && (
        <motion.div
          className={`detailContainer ${styles.container}`}
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
