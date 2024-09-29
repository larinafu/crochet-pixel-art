import Image from "next/image";
import down from "@/public/icons/arrow-thin-chevron-bottom-icon.svg";
import up from "@/public/icons/arrow-thin-chevron-top-icon.svg";
import { useState } from "react";
import { constants } from "@/app/utils/constants";

import Checkmark from "../../general/svgIcons/checkmark/checkmark";

import styles from "./dropdown.module.css";

const Option = ({ subOption, handleChange }) => {
  console.log(subOption);
  return (
    <button
      onClick={() => {
        handleChange(subOption[0]);
      }}
    className={styles.dropdownItem}
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

  console.log(option);

  return (
    <div className={styles.container}>
      <button className={styles.main}>
        {constants.toolOptionText[curOption]}{" "}
        {option.active && <Checkmark size={13} />}
      </button>
      <button className={styles.dropdown} onClick={() => setOpen(!isOpen)}>
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
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
