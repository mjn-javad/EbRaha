import React from "react";
import { useState, useEffect } from "react";
import apiClientBrandPopular from "../../services/api-client_brand";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCart";

const SliderNewArrivels = () => {
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
      .get(`/newArrivels${Param}`)
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.error("New arrivals error:", err));
  }, [gender]);

  return (
    <div className="global-slider">
      <ProductCard products={products} />
    </div>
  );
};

export default SliderNewArrivels;
