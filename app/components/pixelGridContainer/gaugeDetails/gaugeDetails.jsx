import { useState } from "react";

import UpdateContainer from "../../general/updateContainer/updateContainer";
import Toast from "../../general/toast/toast";

import styles from "./gaugeDetails.module.css";

export default function GaugeDetails({ swatch, handleGaugeChange }) {
  const [tempSwatch, setTempSwatch] = useState(swatch);
  const [showToast, setShowToast] = useState(false);

  const activateToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  const handleUpdate = () => {
    if (
      tempSwatch.width === swatch.width &&
      tempSwatch.height === swatch.height
    ) {
      activateToast();
    } else if (!(disabledMessages.length !== 0)) {
      handleGaugeChange(tempSwatch);
    }
  };

  const disabledMessages = (() => {
    const errors = [];
    if (tempSwatch.width === "") {
      errors.push("Number of stitches cannot be empty");
    } else {
      const stitchNum = parseInt(tempSwatch.width);
      if (stitchNum > 50 || stitchNum < 1) {
        errors.push("Number of stitches must be between 1 and 50");
      }
    }

    if (tempSwatch.height === "") {
      errors.push("Number of rows cannot be empty");
    } else {
      const rowNum = parseInt(tempSwatch.height);
      if (rowNum > 50 || rowNum < 1) {
        errors.push("Number of rows must be less than 50");
      }
    }

    return errors;
  })();

  return (
    <>
      <Toast isDisplayed={showToast}>
        <p>No changes detected</p>
      </Toast>
      <UpdateContainer
        disabledMessages={disabledMessages}
        handleCancelledForm={() => {
          setTempSwatch(swatch);
        }}
        handleUpdate={handleUpdate}
        sectionHeader="Gauge Swatch"
      >
        <div className={styles.gaugeContainer}>
          <input
            type="text"
            inputMode="numeric"
            id="numRows"
            name="numRows"
            value={tempSwatch.height}
            onChange={(e) => {
              if (/^[0*]+$/.test(e.target.value)) {
                setTempSwatch({
                  ...tempSwatch,
                  height: "",
                });
              } else if (
                /^\d+$/.test(e.target.value) ||
                e.target.value === ""
              ) {
                setTempSwatch({
                  ...tempSwatch,
                  height: e.target.value,
                });
              }
            }}
            className={styles.rowInput}
          />
          <label htmlFor="numRows" className={styles.gaugeLabel}>
            Number of rows
          </label>

          <div className={styles.gaugeSquare}>
            <p>
              <strong>4&quot; x 4&quot;</strong>
            </p>
          </div>
          <input
            type="text"
            inputMode="numeric"
            id="numStitches"
            name="numStitches"
            className={styles.stitchInput}
            value={tempSwatch.width}
            onChange={(e) => {
              if (/^[0*]+$/.test(e.target.value)) {
                setTempSwatch({
                  ...tempSwatch,
                  width: "",
                });
              } else if (
                /^\d+$/.test(e.target.value) ||
                e.target.value === ""
              ) {
                setTempSwatch({
                  ...tempSwatch,
                  width: e.target.value,
                });
              }
            }}
          />
          <label htmlFor="numStitches" className={styles.gaugeLabel}>
            Number of stitches
          </label>
        </div>
      </UpdateContainer>
    </>
  );
}
