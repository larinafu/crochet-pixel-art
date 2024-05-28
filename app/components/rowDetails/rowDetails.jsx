import ColorSwatch from "../colorSwatch/colorSwatch";
import styles from "./rowDetails.module.css";

export default function RowDetails({ row }) {
  let rowColors = [];
  for (const rowColor of row) {
    if (
      rowColors.length !== 0 &&
      rowColors[rowColors.length - 1].colorName === rowColor.colorName
    ) {
      rowColors[rowColors.length - 1].count += 1;
    } else {
      rowColors.push({ colorName: rowColor.colorName, count: 1 });
    }
  }
  return (
    <section className={`${styles.rowDetailsContainer} detailContainer`}>
      <table className={styles.colorRow}>
        <tbody>
          {row && (
            <tr>
              {row.map((resItem, itemIdx) => {
                return (
                  <td
                    key={itemIdx}
                    style={{
                      backgroundColor: resItem.colorName,
                    }}
                  ></td>
                );
              })}
            </tr>
          )}
        </tbody>
      </table>
      <div className={styles.colorListContainer}>
        <h3>Color order</h3>
        <h4>from left {"->"} right</h4>
        <ul className={styles.colorList}>
          {rowColors.map((segment, idx) => (
            <li key={idx}>
              <ColorSwatch color={segment.colorName} size={20} />
              <p>{segment.count} {segment.colorName}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
