import React, { useEffect, useState } from "react";
import colors from "../services/colors";
import { CFormSelect } from "@coreui/react";
import { useTranslation } from "react-i18next";

const ColorSelector = ({
  value,
  selectStatement,
  onChange: propsOnChange,
  className,
}) => {
  const { t, i18n } = useTranslation("translation", { keyPrefix: "colors" });
  const [color, setColor] = useState(value);
  const onChange = (e) => {
    setColor(e.target.value);
    propsOnChange?.(e);
  };
  useEffect(() => setColor(value), [value]);
  const secondaryColors = ["Black", "Blue", "Maroon", "Navy"];
  return (
    <CFormSelect
      style={{
        backgroundColor: color,
        color: secondaryColors.includes(color) ? "White" : "Black",
      }}
      onChange={onChange}
      className={className}
    >
      {selectStatement && (
        <option value="" disabled>
          select color
        </option>
      )}
      {colors.map((color, i) => (
        <option
          value={color}
          style={{
            backgroundColor: color,
            color: secondaryColors.includes(color) ? "White" : "Black",
          }}
          key={`${i}color`}
        >
          {t(color)}
        </option>
      ))}
    </CFormSelect>
  );
};

export default ColorSelector;
