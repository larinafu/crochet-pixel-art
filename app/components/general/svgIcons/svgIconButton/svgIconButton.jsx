import { useState } from "react";
import Image from "next/image";

import styles from "./svgIconButton.module.css";

export default function SvgIconButton({
  alt,
  handleClick,
  size,
  icon,
  hoverIcon,
}) {
  const [isActive, setIsActive] = useState(false);

  return (
    <button
      className={styles.btn}
      onClick={handleClick}
      onFocus={() => setIsActive(true)}
      onMouseOver={() => {
        setIsActive(true);
      }}
      onMouseLeave={() => {
        setIsActive(false);
      }}
      onBlur={() => setIsActive(false)}
    >
      <Image src={isActive ? hoverIcon : icon} alt={alt} width={size} />
    </button>
  );
}
