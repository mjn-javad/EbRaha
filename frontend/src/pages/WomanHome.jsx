import React from "react";
import BestSellersBanner from "../components/Banner/BestSellersBanner";
import GlobalSlider from "../components/Slider/GlobalSlider";
import GlobalBanner from "../components/Banner/GlobalBanner";
import HorizentalScroll from "../components/HorizentalScroll/HorizentalScroll";
import ProductFinderBox from "../components/OrderOnWhatsApp/ProductFinderBox";
import FirstBanner from "../components/Banner/FirstBanner";

const WomenHome = () => {
  return (
    <div className="home-page">
      <FirstBanner gender={"female"} />
      <HorizentalScroll />

      <GlobalSlider
        myQuery={"?gender=female&sort=created_at&order=DESC&limit=12"}
        header={"New signatures"}
        title={"Just arrived"}
        navigateLink={
          "/slider-products?gender=female&sort=created_at&order=DESC"
        }
        limit={12}
        infiniteScroll={false}
        scrollOnMobile={true}
        scrollOnLaptop={true}
      />

      <BestSellersBanner gender={"female"} />

      <GlobalSlider
        myQuery={"?type=watch&gender=female&limit=20"}
        header={"The finishing touch"}
        title={"Women’s watches"}
        navigateLink={"/slider-products?type=watch&gender=female"}
        limit={20}
        infiniteScroll={false}
        scrollOnMobile={true}
        scrollOnLaptop={true}
      />

      <GlobalBanner mobileSortOrder={7} laptopSortOrder={8} />

      <ProductFinderBox />
    </div>
  );
};

export default WomenHome;
