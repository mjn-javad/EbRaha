import React, { useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import ImgPoductMen from "../../assets/ShopByTypePic/Men/Shoes.png";
import ImgGlassMen from "../../assets/ShopByTypePic/Men/SunGlasses.png";
import ImgLuggMen from "../../assets/ShopByTypePic/Men/Luggages.png";
import ImgBagMen from "../../assets/ShopByTypePic/Men/Bags.png";
import ImgPoductWomen from "../../assets/ShopByTypePic/Women/Shoes.png";
import ImgGlassWomen from "../../assets/ShopByTypePic/Women/SunGlasses.png";
import ImgLuggWomen from "../../assets/ShopByTypePic/Women/Luggages.png";
import ImgBagWomen from "../../assets/ShopByTypePic/Women/Bags.png";

const ShopByType = ({ navigatePath = "/slider-products" }) => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const gender = useMemo(() => {
    const selected = new URLSearchParams(search).get("gender")?.toLowerCase();
    if (selected) return selected;
    return pathname.startsWith("/men") ? "male" : "female";
  }, [pathname, search]);

  const isMale = gender === "male" || gender === "men";
  const categories = [
    [
      "Poducts",
      "poduct",
      isMale ? ImgPoductMen : ImgPoductWomen,
      "Step into focus",
    ],
    ["Bags", "bag", isMale ? ImgBagMen : ImgBagWomen, "Carry with intent"],
    [
      "Eyewear",
      "glasses",
      isMale ? ImgGlassMen : ImgGlassWomen,
      "Frame your point of view",
    ],
    [
      "Luggage",
      "luggage",
      isMale ? ImgLuggMen : ImgLuggWomen,
      "Travel beautifully",
    ],
  ];

  const openCategory = (type) => {
    const params = new URLSearchParams(search);
    params.set("type", type);
    params.set("gender", gender);
    params.delete("brand");
    navigate(`${navigatePath}?${params.toString()}`);
  };

  return (
    <section className="category-edit">
      <div className="category-edit__head">
        <p>Shop by category</p>
        <h2>Curated for every expression.</h2>
      </div>

      <div className="category-edit__grid">
        {categories.map(([title, type, image, copy], index) => (
          <button key={type} type="button" onClick={() => openCategory(type)}>
            <span className="category-edit__number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="category-edit__media">
              <img src={image} alt={title} draggable="false" />
            </span>
            <span className="category-edit__copy">
              <span>
                <strong>{title}</strong>
                <small>{copy}</small>
              </span>
              <ArrowUpRight size={19} />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ShopByType;
