import React from "react";

const BrandMark = ({ inverted = false, compact = false, className = "" }) => {
  return (
    <span
      className={`brand-mark ${inverted ? "brand-mark--inverted" : ""} ${
        compact ? "brand-mark--compact" : ""
      } ${className}`}
      aria-label="EbRahaStyle"
    >
      <span className="brand-mark__monogram" aria-hidden="true">
        ER
      </span>
      <span className="brand-mark__name">
        <span>EbRaha</span>
        <span>Style</span>
      </span>
    </span>
  );
};

export default BrandMark;
