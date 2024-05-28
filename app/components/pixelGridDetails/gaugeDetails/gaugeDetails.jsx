import { useContext } from "react";

import { ModeContext } from "@/app/utils/ModeContext";

import styles from "./gaugeDetails.module.css";

export default function GaugeDetails({tempSwatch, setTempSwatch, handleGaugeChange}) {
  const isEditMode = useContext(ModeContext);
  return (
    <section className="detailContainer">
      <h3>Gauge Swatch</h3>
      <div className={styles.gaugeContainer}>
        {isEditMode ? (
          <>
            <input
              type="number"
              id="numRows"
              name="numRows"
              value={tempSwatch.height}
              onChange={(e) => {
                setTempSwatch({ ...tempSwatch, height: e.target.value });
                // handleGaugeChange({ ...tempSwatch, height: e.target.value });
              }}
              className={styles.rowInput}
            />
            <label htmlFor="numRows" className={styles.gaugeLabel}>
              Number of rows
            </label>
          </>
        ) : (
          <p>{tempSwatch.height}</p>
        )}

        <div>
          <div className={styles.gaugeSquare}>
            <p>
              <strong>4" x 4"</strong>
            </p>
          </div>
          {isEditMode ? (
            <>
              {" "}
              <input
                type="number"
                id="numStitches"
                name="numStitches"
                className={styles.stitchInput}
                value={tempSwatch.width}
                onChange={(e) => {
                  setTempSwatch({ ...tempSwatch, width: e.target.value });
                  // handleGaugeChange({ ...tempSwatch, width: e.target.value });
                }}
              />
              <label htmlFor="numStitches" className={styles.gaugeLabel}>
                Number of stitches
              </label>
            </>
          ) : (
            <p>{tempSwatch.width}</p>
          )}
        </div>
      </div>
      {isEditMode && (
        <button
          type="button"
          onClick={() => {
            handleGaugeChange(tempSwatch);
          }}
        >
          update
        </button>
      )}
    </section>
  );
}
