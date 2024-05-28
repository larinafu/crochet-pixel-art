import ColorSwatch from "../colorSwatch/colorSwatch";

export default function ColorEditor({ pixelsSelected }) {
  console.log(Object.keys(pixelsSelected));
  return (
    <section className="detailContainer">
      <ul>
        {Object.keys(pixelsSelected).map((colorName) => (
          <li>
            <p>
              <ColorSwatch size={20} color={colorName} /> {colorName} (
              {pixelsSelected[colorName].length})
            </p>
            <ul>
              {pixelsSelected[colorName].map((pixel) => (
                <li>
                  <input type="checkbox" checked={pixel.checked}></input>
                  {pixel.row}, {pixel.column}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
