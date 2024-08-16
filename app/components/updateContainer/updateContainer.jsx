import { useEffect, useRef, useState } from "react";

import styles from "./updateContainer.module.css";

export default function UpdateContainer({
  children,
  handleUpdate,
  handleCancelledForm,
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
    }
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
        {children}
        <button className={`primaryBtn ${styles.updateBtn}`}>update</button>
      </form>
    </section>
  );
}
