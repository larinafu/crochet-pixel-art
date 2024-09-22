import { Roboto, Lato } from "next/font/google";
import styles from "./textButton.module.css";

export const lato = Lato({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export default function TextButton({
  children,
  disabled,
  handleClick,
  className,
}) {
  const additionalClassNames = `${
    disabled ? styles.disabled : styles.active
  } ${className}`;

  return (
    <button
      className={`${styles.button} ${additionalClassNames}`}
      onClick={handleClick}
    >
      <p className={lato.className}>{children}</p>
    </button>
  );
}
