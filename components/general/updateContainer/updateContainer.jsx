import Image from "next/image";
import exclamationRoundIcon from "@/public/icons/exclamation-round-icon.svg";
import { useEffect, useRef, useState } from "react";

import TextButton from "../buttons/textButton/textButton";
import Toast from "../toast/toast";

import styles from "./updateContainer.module.css";

export default function UpdateContainer({
  children,
  handleUpdate,
  handleCancelledForm,
  disabledMessages,
  sectionHeader,
}) {
  const containerRef = useRef(null);
  const [isFocused, setFocused] = useState(false);
  const [showErrorMsgs, setShowErrorMsgs] = useState(false);

  useEffect(() => {
    const handleFocus = () => {
      if (containerRef.current.contains(document.activeElement)) {
        setFocused(true);
      } else {
        handleCancelledForm();
        setFocused(false);
      }
    };
    const handleOutsideClick = (e) => {
      if (!containerRef.current.contains(e.target)) {
        setFocused(false);
        handleCancelledForm();
      }
    };

    document.addEventListener("focusin", handleFocus);
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [containerRef, handleCancelledForm]);
  return (
    <section
      ref={containerRef}
      className={`detailContainer ${styles.container} ${
        isFocused ? styles.focused : ""
      }`}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
          setFocused(false);
        }}
      >
        <div className={styles.headerContainer}>
          <h3>{sectionHeader}</h3>
          {disabledMessages?.length > 0 && (
            <div className={styles.errorMessageContainer}>
              <Image
                src={exclamationRoundIcon}
                className={styles.exclamationRoundIcon}
                width="20"
                alt="exclamation round icon"
                onMouseEnter={() => setShowErrorMsgs(true)}
                onMouseLeave={() => setShowErrorMsgs(false)}
              />
              <Toast isDisplayed={showErrorMsgs}>
                <ul className={styles.errorMsgs}>
                  {disabledMessages.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              </Toast>
            </div>
          )}
        </div>
        {children}
        <TextButton
          disabled={disabledMessages && disabledMessages.length !== 0}
          className={styles.updateBtn}
        >
          update
        </TextButton>
      </form>
    </section>
  );
}
