import Image from "next/image";
import down from "@/public/icons/arrow-thin-chevron-bottom-icon.svg";
import up from "@/public/icons/arrow-thin-chevron-top-icon.svg";
import { useState } from "react";
import { constants } from "@/utils/constants";

import Checkmark from "../../svgIcons/checkmark/checkmark";

import btnStyles from "../buttons.module.css";
import styles from "./dropdown.module.css";

const Option = ({ subOption, handleChange, setOpen }) => {
  return (
    <button
      onClick={() => {
        handleChange(subOption[0]);
        setOpen(false);
      }}
      className={`${btnStyles.button} ${styles.dropdownItem} ${btnStyles.active}`}
    >
      {constants.toolOptionText[subOption[0]]}
    </button>
  );
};

export default function Dropdown({ option, handleChange }) {
  const [isOpen, setOpen] = useState(false);
  const curOption = Object.entries(option.subOptions).find(
    ([_, active]) => active === true
  )[0];
  const classNames = `${btnStyles.button} ${
    option.active ? btnStyles.selected : ""
  } ${btnStyles.active} ${isOpen ? styles.opened : ""}`;

  return (
    <div className={styles.container}>
      <button
        className={`${classNames} ${styles.main}`}
        onClick={() => {
          handleChange();
        }}
      >
        {constants.toolOptionText[curOption]}{" "}
        {option.active && <Checkmark size={13} />}
      </button>
      <button
        className={`${classNames} ${styles.dropdown}`}
        onClick={() => setOpen(!isOpen)}
      >
        {isOpen ? (
          <Image src={up} alt="collapse" width={13} />
        ) : (
          <Image src={down} alt="expand" width={13} />
        )}
      </button>
      {isOpen && (
        <ul className={styles.menu}>
          {Object.entries(option.subOptions).map((subOption, idx) => {
            return (
              <li key={subOption[0]}>
                <Option
                  subOption={subOption}
                  handleChange={handleChange}
                  setOpen={setOpen}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
