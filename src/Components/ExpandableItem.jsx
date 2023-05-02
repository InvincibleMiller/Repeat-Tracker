import React, { useState } from "react";
import { BiCaretRightCircle, BiCaretDownCircle } from "react-icons/bi";

const ExpandableItem = ({ title = "", inner, indent = true }) => {
  const [active, setActive] = useState(false);

  return (
    <div className="block">
      {title != "" && (
        <h4 onClick={() => setActive(!active)}>
          {!active && <BiCaretDownCircle className="inline-block mr-1" />}
          {active && <BiCaretRightCircle className="inline-block mr-1" />}
          {title}
        </h4>
      )}
      {active && <div className={`${indent ? "mx-2" : ""}`}>{inner}</div>}
    </div>
  );
};

export default ExpandableItem;
