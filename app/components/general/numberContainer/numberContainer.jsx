import { Courier_Prime } from "next/font/google";

import styles from "./numberContainer.module.css";

export const courier = Courier_Prime({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
});

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
