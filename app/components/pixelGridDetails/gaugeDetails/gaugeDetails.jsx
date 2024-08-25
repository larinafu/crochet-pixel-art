import { useState } from "react";
import UpdateContainer from "../../updateContainer/updateContainer";

import styles from "./gaugeDetails.module.css";

export default function GaugeDetails({
  swatch,
  handleGaugeChange,
}) {
  const [tempSwatch, setTempSwatch] = useState(swatch);

  const handleUpdate = () => {
    handleGaugeChange(tempSwatch);
  }
  return (
    <UpdateContainer
      handleUpdate={handleUpdate}
      handleCancelledForm={() => {
        setTempSwatch(swatch);
      }}
    >
      <h3>Gauge Swatch</h3>
      <div className={styles.gaugeContainer}>
        <input
          type="number"
          id="numRows"
          name="numRows"
          value={tempSwatch.height}
          onChange={(e) => {
            setTempSwatch({
              ...tempSwatch,
              height: Math.max(3, Math.min(e.target.value, 50)),
            });
          }}
          className={styles.rowInput}
        />
        <label htmlFor="numRows" className={styles.gaugeLabel}>
          Number of rows
        </label>

        <div>
          <div className={styles.gaugeSquare}>
            <p>
              <strong>4&quot; x 4&quot;</strong>
            </p>
          </div>{" "}
          <input
            type="number"
            id="numStitches"
            name="numStitches"
            className={styles.stitchInput}
            value={tempSwatch.width}
            onChange={(e) => {
              setTempSwatch({
                ...tempSwatch,
                width: Math.max(3, Math.min(e.target.value, 50)),
              });
            }}
          />
          <label htmlFor="numStitches" className={styles.gaugeLabel}>
            Number of stitches
          </label>
        </div>
      </div>
    </UpdateContainer>
  );
}
