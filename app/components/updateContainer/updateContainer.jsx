import Image from "next/image";
import exclamationRoundIcon from "@/public/icons/exclamation-round-icon.svg";

import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    const handleFocus = () => {
      if (containerRef.current.contains(document.activeElement)) {
        console.log("here");
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
    const handleFocusOut = () => {
      setFocused(false);
      console.log(document.activeElement);
      console.log(containerRef.current.node);
      //   console.log(document)
      if (!containerRef.current.contains(document.activeElement)) {
        handleCancelledForm();
      }
    };

    document.addEventListener("focusin", handleFocus);
    document.addEventListener("mousedown", handleOutsideClick);
    // containerRef.current?.addEventListener("focusin", handleFocus);
    // containerRef.current?.addEventListener("focusout", handleFocusOut);
    return () => {
      //   containerRef.current?.removeEventListener("focusin", handleFocus);
      //   containerRef.current?.removeEventListener("focusout", handleFocusOut);
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
              />
              <div className={styles.errorMessages}>
                <ul>
                  {disabledMessages.map((msg) => (
                    <li>{msg}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        {children}
        <button
          disabled={disabledMessages && disabledMessages.length !== 0}
          className={`primaryBtn ${styles.updateBtn}`}
        >
          update
        </button>
      </form>
    </section>
  );
}
