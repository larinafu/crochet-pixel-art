import { useEffect, useState, useRef } from "react";

import styles from "./imageViewbox.module.css";

export default function ImageViewbox({
  curImg,
  gridContainerDim,
  setGridContainerDim,
  gridScrollPos,
  setGridScrollPos,
}) {
  console.log(gridContainerDim);
  const [pointerDownPos, setPointerDownPos] = useState(null);
  const [viewPos, setViewPos] = useState({ left: 0, top: 0 });
  const [draggingViewPos, setDraggingViewPos] = useState({ left: 0, top: 0 });
  const imgRef = useRef(null);

  const imgRefBoundingClient = imgRef?.current?.getBoundingClientRect();
  const imgWidth = imgRefBoundingClient?.width;
  const imgHeight = imgRefBoundingClient?.height;
  const imgOffsetTop = imgRefBoundingClient?.top;
  const imgOffsetLeft = imgRefBoundingClient?.left;
  const maxLeft = 100 - gridContainerDim.viewableGridWidthPercent;
  const maxTop = 100 - gridContainerDim.viewableGridHeightPercent;
  console.log(maxLeft, maxTop);

  const handleDrag = (e) => {
    console.log("here");
    if (pointerDownPos) {
      const percentLeftMoved =
        ((e.pageX - pointerDownPos.left) / imgWidth) * 100;
      const percentTopMoved =
        ((e.pageY - pointerDownPos.top) / imgHeight) * 100;
      setDraggingViewPos({
        left: Math.min(maxLeft, Math.max(0, viewPos.left + percentLeftMoved)),
        top: Math.min(maxTop, Math.max(0, viewPos.top + percentTopMoved)),
      });
      setGridContainerDim({
        ...gridContainerDim,
        viewableGridLeftPercent: Math.min(
          maxLeft,
          Math.max(0, viewPos.left + percentLeftMoved)
        ),
        viewableGridTopPercent: Math.min(
          maxTop,
          Math.max(0, viewPos.top + percentTopMoved)
        ),
      });
      console.log(e.pageX - pointerDownPos.left, e.pageY - pointerDownPos.top);
      console.log(percentLeftMoved, percentTopMoved);
    }
  };

  return (
    <section className={`detailContainer ${styles.container}`}>
      <div className={styles.innerContainer} ref={imgRef}>
        <div
          draggable={false}
          className={styles.viewBox}
          style={{
            width: `${gridContainerDim.viewableGridWidthPercent}%`,
            height: `${gridContainerDim.viewableGridHeightPercent}%`,
            top: `${gridContainerDim.viewableGridTopPercent}%`,
            left: `${gridContainerDim.viewableGridLeftPercent}%`,
          }}
          onPointerDown={(e) => {
            e.preventDefault();
            setPointerDownPos({
              left: e.pageX,
              top: e.pageY,
            });
          }}
          onPointerUp={(e) => {
            e.preventDefault()
            setPointerDownPos(null);
            setViewPos({ ...draggingViewPos });
          }}
          onPointerMove={handleDrag}
          onPointerLeave={(e) => {
            e.preventDefault();
            setPointerDownPos(null);
            setViewPos({ ...draggingViewPos });
          }}
        ></div>
        <img
          className={styles.smallImg}
          src={curImg}
          alt="uploaded image"
          draggable={false}
        />
      </div>
    </section>
  );
}
