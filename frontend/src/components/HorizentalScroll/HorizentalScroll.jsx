import React from "react";
import ShopByType from "./ShopByType";
import BrandScroller from "./BrandScroller";

const HorizentalScroll = () => {
  return (
    <div className="home-curation">
      <BrandScroller />
      <ShopByType />
    </div>
  );
};

export default HorizentalScroll;
