export const postFetcher = (...args) => {
    try {
        const res = fetch("/api", {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: JSON.stringify({
            numStitches: args.numStitches,
            imgData: args.imgData,
            numRows: args.numRows,
            numStitches: args.numStitches,
            pixelsPerRow: args.pixelsPerRow,
            pixelsPerStitch: args.pixelsPerStitch,
            imgDim: args.imgDim,
          }),
        });
        if (res) {
          const data = res.json();
          const pixels = data.grid;
          pixelsDispatch({ type: "refresh_pixels", pixels: pixels });
          const initialPixelSize =
            Math.ceil(
              Math.min(
                (vhToPx(PIXELGRID_CONTAINER_HEIGHT) / pixels?.length) *
                  (1 / widthHeightRatio),
                vwToPx(PIXELGRID_CONTAINER_WIDTH) / pixels?.[0]?.length
              ) / 5
            ) * 5 || 0;
          setPixelSize(initialPixelSize);
          setMaxPixelSize((m) => Math.max(m, initialPixelSize));
        }
      } catch (err) {
        console.log(err);
      }
};
