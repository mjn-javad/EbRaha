import React from "react";
import { useState, useEffect } from "react";
import apiClientBrandPopular from "../../services/api-client";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCart";
import ProductFinderBox from "../OrderOnWhatsApp/ProductFinderBox";
import BrandScroller from "../HorizentalScroll/BrandScroller";

const SliderBestSellers = ({ header, title, navigateLink, limit }) => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const gender = searchParams.get("gender");

  useEffect(() => {
    let Param = "";

    const params = [];
    if (gender) params.push(`gender=${encodeURIComponent(gender)}`);
    if (params.length > 0) {
      Param = `?${params.join("&")}`;
    }

    apiClientBrandPopular
      .get(`/bestSellers${Param}`)
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.error("Best sellers error:", err));
  }, [gender]);

  return (
    <div className="global-slider">
      {limit === undefined && <ProductFinderBox />}
      <BrandScroller />
      <ProductCard
        products={products}
        header={header}
        title={title}
        navigateLink={navigateLink}
        scrollOnMobile={limit !== undefined}
        apiUrl="http://localhost:4000/v1/products"
        limit={limit}
      />
    </div>
  );
};

export default SliderBestSellers;
