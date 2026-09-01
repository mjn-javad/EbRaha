import React from "react";
import BestSellersBanner from "../components/Banner/BestSellersBanner";
import GlobalSlider from "../components/Slider/GlobalSlider";
import GlobalBanner from "../components/Banner/GlobalBanner";
import HorizentalScroll from "../components/HorizentalScroll/HorizentalScroll";
import BigSizeGlobalSlider from "../components/Slider/BigSizeGlobalSlider";
import ProductFinderBox from "../components/OrderOnWhatsApp/ProductFinderBox";
import FirstBanner from "../components/Banner/FirstBanner";

const WomenHome = () => {
  return (
    <div className="home-page">
      <FirstBanner gender={"male"} />
      <HorizentalScroll />

      {/* <GlobalSlider
        myQuery={"?gender=male&sort=created_at&order=DESC&limit=12"}
        header={"New signatures"}
        title={"Just arrived"}
        navigateLink={"/slider-products?gender=male&sort=created_at&order=DESC"}
        limit={12}
        infiniteScroll={false}
        scrollOnMobile={true}
        scrollOnLaptop={true}
      />

      <BestSellersBanner gender={"male"} />

      <BigSizeGlobalSlider
        myQuery={"?limit=20&gender=male"}
        limit={20}
        header={"Big Sizes Available"}
      />

      <GlobalSlider
        myQuery={"?type=watch&gender=male&limit=20"}
        header={"Finishing details"}
        title={"Men’s watches"}
        navigateLink={"/slider-products?type=watch&gender=male"}
        limit={20}
        infiniteScroll={false}
        scrollOnMobile={true}
        scrollOnLaptop={true}
      />

      <GlobalBanner mobileSortOrder={9} laptopSortOrder={10} />

      <ProductFinderBox /> */}
    </div>
  );
};

export default WomenHome;
