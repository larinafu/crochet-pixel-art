import { lato } from "@/utils/fonts";
import btnStyles from "../buttons.module.css";
import styles from "./textButton.module.css";


export default function TextButton({
  children,
  disabled,
  handleClick,
  className,
}) {
  const additionalClassNames = `${
    disabled ? btnStyles.disabled : btnStyles.active
  } ${className}`;

  return (
    <button
      className={`${btnStyles.button} ${additionalClassNames}`}
      onClick={handleClick}
    >
      <p className={lato.className}>{children}</p>
    </button>
  );
}
