import React, { useMemo } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import ImgPoductMen from "../../assets/ShopByTypePic/Men/Shoes.png";
import ImgGlassMen from "../../assets/ShopByTypePic/Men/SunGlasses.png";
import ImgLuggMen from "../../assets/ShopByTypePic/Men/Luggages.png";
import ImgBagMen from "../../assets/ShopByTypePic/Men/Bags.png";
import ImgPoductWomen from "../../assets/ShopByTypePic/Women/Shoes.png";
import ImgGlassWomen from "../../assets/ShopByTypePic/Women/SunGlasses.png";
import ImgLuggWomen from "../../assets/ShopByTypePic/Women/Luggages.png";
import ImgBagWomen from "../../assets/ShopByTypePic/Women/Bags.png";
import ImgClothesMen from "../../assets/ShopByTypePic/Men/Clothes.webp";
import ImgAccessoriesMen from "../../assets/ShopByTypePic/Men/Accessories.webp";
import ImgClothesWomen from "../../assets/ShopByTypePic/Women/Clothes.webp";
import ImgAccessoriesWomen from "../../assets/ShopByTypePic/Women/Accessories.webp";
import ImgMobileShoesMen from "../../assets/ShopByTypePic/Men/Mobile/Shoes.webp";
import ImgMobileBagsMen from "../../assets/ShopByTypePic/Men/Mobile/Bags.webp";
import ImgMobileEyewearMen from "../../assets/ShopByTypePic/Men/Mobile/Eyewear.webp";
import ImgMobileLuggageMen from "../../assets/ShopByTypePic/Men/Mobile/Luggage.webp";
import ImgMobileClothesMen from "../../assets/ShopByTypePic/Men/Mobile/Clothes.webp";
import ImgMobileAccessoriesMen from "../../assets/ShopByTypePic/Men/Mobile/Accessories.webp";
import ImgMobileShoesWomen from "../../assets/ShopByTypePic/Women/Mobile/Shoes.webp";
import ImgMobileBagsWomen from "../../assets/ShopByTypePic/Women/Mobile/Bags.webp";
import ImgMobileEyewearWomen from "../../assets/ShopByTypePic/Women/Mobile/Eyewear.webp";
import ImgMobileLuggageWomen from "../../assets/ShopByTypePic/Women/Mobile/Luggage.webp";
import ImgMobileClothesWomen from "../../assets/ShopByTypePic/Women/Mobile/Clothes.webp";
import ImgMobileAccessoriesWomen from "../../assets/ShopByTypePic/Women/Mobile/Accessories.webp";

const ShopByType = ({ navigatePath = "/brands-by-type" }) => {
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
      "Shoes",
      "shoe",
      isMale ? ImgPoductMen : ImgPoductWomen,
      isMale ? ImgMobileShoesMen : ImgMobileShoesWomen,
      "Step into focus",
    ],
    [
      "Bags",
      "bag",
      isMale ? ImgBagMen : ImgBagWomen,
      isMale ? ImgMobileBagsMen : ImgMobileBagsWomen,
      "Carry with intent",
    ],
    [
      "Eyewear",
      "glasses",
      isMale ? ImgGlassMen : ImgGlassWomen,
      isMale ? ImgMobileEyewearMen : ImgMobileEyewearWomen,
      "Frame your point of view",
    ],
    [
      "Luggage",
      "luggage",
      isMale ? ImgLuggMen : ImgLuggWomen,
      isMale ? ImgMobileLuggageMen : ImgMobileLuggageWomen,
      "Travel beautifully",
    ],
    [
      "Clothes",
      "clothes",
      isMale ? ImgClothesMen : ImgClothesWomen,
      isMale ? ImgMobileClothesMen : ImgMobileClothesWomen,
      "Dress with distinction",
    ],
    [
      "Accessories",
      "accessories",
      isMale ? ImgAccessoriesMen : ImgAccessoriesWomen,
      isMale ? ImgMobileAccessoriesMen : ImgMobileAccessoriesWomen,
      "Finish every look",
    ],
  ];

  const openCategory = (type) => {
    const params = new URLSearchParams();
    params.set("type", type);
    params.set("gender", gender);
    navigate(`${navigatePath}?${params.toString()}`);
  };

  return (
    <section className="category-edit">
      <div className="category-edit__head">
        <p>Shop by category</p>
        <h2>Curated for every expression.</h2>
      </div>

      <div className="category-edit__grid">
        {categories.map(([title, type, image, mobileImage, copy], index) => (
          <button key={type} type="button" onClick={() => openCategory(type)}>
            <span className="category-edit__number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="category-edit__media">
              <picture>
                <source media="(max-width: 680px)" srcSet={mobileImage} />
                <img src={image} alt={title} draggable="false" />
              </picture>
            </span>
            <span className="category-edit__copy">
              <span>
                <strong>{title}</strong>
                <small>{copy}</small>
              </span>
              <ArrowUpRight
                className="category-edit__desktop-arrow"
                size={19}
              />
              <ChevronRight
                className="category-edit__mobile-arrow"
                size={20}
              />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ShopByType;
