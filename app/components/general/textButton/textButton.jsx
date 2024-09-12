import styles from "./textButton.module.css";

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
      {children}
    </button>
  );
}
