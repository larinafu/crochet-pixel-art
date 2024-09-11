import styles from "./imageViewbox.module.css";

export default function ImageViewbox({
  curImg,
}) {

  return (
    <section
      className={`detailContainer ${styles.container}`}
    >
      <img
        className={styles.smallImg}
        src={curImg}
        alt="uploaded image"
      />
    </section>
  );
}
