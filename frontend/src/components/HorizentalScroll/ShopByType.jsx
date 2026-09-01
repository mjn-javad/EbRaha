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
import ImgClothesMen from "../../assets/ShopByTypePic/Men/Clothes.webp";
import ImgBestSellerMen from "../../assets/ShopByTypePic/Men/BestSeller.webp";
import ImgLimitedEditionMen from "../../assets/ShopByTypePic/Men/LimitedEdition.webp";
import ImgWatchesMen from "../../assets/ShopByTypePic/Men/Watches.webp";
import ImgClothesWomen from "../../assets/ShopByTypePic/Women/Clothes.webp";
import ImgBestSellerWomen from "../../assets/ShopByTypePic/Women/BestSeller.webp";
import ImgLimitedEditionWomen from "../../assets/ShopByTypePic/Women/LimitedEdition.webp";
import ImgWatchesWomen from "../../assets/ShopByTypePic/Women/Watches.webp";

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
    {
      title: "Bags",
      type: "bag",
      image: isMale ? ImgBagMen : ImgBagWomen,
      copy: "Carry with intent",
    },
    {
      title: "Shoes",
      type: "shoe",
      image: isMale ? ImgPoductMen : ImgPoductWomen,
      copy: "Step into focus",
    },
    {
      title: "Eyewear",
      type: "glasses",
      image: isMale ? ImgGlassMen : ImgGlassWomen,
      copy: "Frame your point of view",
    },
    {
      title: "Luggage",
      type: "luggage",
      image: isMale ? ImgLuggMen : ImgLuggWomen,
      copy: "Travel beautifully",
    },
    {
      title: "Clothes",
      type: "clothes",
      image: isMale ? ImgClothesMen : ImgClothesWomen,
      copy: "Dress with distinction",
    },

    {
      title: "Watches",
      type: "watch",
      image: isMale ? ImgWatchesMen : ImgWatchesWomen,
      copy: "Make every moment count",
    },
    {
      title: "Limited Edition",
      type: "limited_edition",
      image: isMale ? ImgLimitedEditionMen : ImgLimitedEditionWomen,
      copy: "Explore rare pieces",
    },
    {
      title: "Best Seller",
      type: "best_seller",
      image: isMale ? ImgBestSellerMen : ImgBestSellerWomen,
      copy: "Discover the most wanted",
      directPath: "/bestSellers",
    },
  ];

  const openCategory = ({ type, directPath }) => {
    const params = new URLSearchParams();
    params.set("gender", gender);

    if (directPath) {
      navigate(`${directPath}?${params.toString()}`);
      return;
    }

    params.set("type", type);
    navigate(`${navigatePath}?${params.toString()}`);
  };

  return (
    <section className="category-edit mb-0">
      <div className="category-edit__grid">
        {categories.map((category, index) => (
          <button
            key={category.type}
            type="button"
            onClick={() => openCategory(category)}
          >
            <span className="category-edit__number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="category-edit__media">
              <img
                src={category.image}
                alt={category.title}
                draggable="false"
              />
            </span>
            <span className="category-edit__copy">
              <span>
                <strong>{category.title}</strong>
                <small>{category.copy}</small>
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
