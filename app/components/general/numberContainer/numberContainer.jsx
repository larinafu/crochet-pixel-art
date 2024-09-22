import { courier } from "@/app/utils/fonts";

import styles from "./numberContainer.module.css";

export default function NumberContainer({ number, size }) {
  return (
    <div
      className={styles.specNumber}
      style={{
        height: size,
        weight: size,
      }}
    >
      <p className={courier.className}>{number}</p>
    </div>
  );
}
