import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Woman from "../assets/LandingPage/women.jpg";
import Man from "../assets/LandingPage/men.jpg";
import BrandMark from "../components/Brand/BrandMark";

const collections = [
  {
    gender: "women",
    image: Woman,
    eyebrow: "",
    title: "",
    number: "01",
  },
  {
    gender: "men",
    image: Man,
    eyebrow: "",
    title: "",
    number: "02",
  },
];

function GenderLanding() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleClick = (gender) => {
    if (selected) return;
    setSelected(gender);
    window.setTimeout(() => navigate(`/${gender}`), 520);
  };

  return (
    <main className="collection-gateway">
      <div className="collection-gateway__brand">
        <BrandMark inverted />
        <p>Curated luxury · Dubai</p>
      </div>

      <div className="collection-gateway__grid">
        {collections.map((item) => (
          <button
            key={item.gender}
            type="button"
            onClick={() => handleClick(item.gender)}
            className={`collection-gateway__panel collection-gateway__panel--${
              item.gender
            } ${selected === item.gender ? "is-selected" : ""} ${
              selected && selected !== item.gender ? "is-muted" : ""
            }`}
          >
            <img src={item.image} alt={`${item.gender} collection`} />
            <span className="collection-gateway__wash" />
            <span className="collection-gateway__number">{item.number}</span>

            <span className="collection-gateway__copy">
              <span className="collection-gateway__eyebrow">
                {item.eyebrow}
              </span>
              <strong>{item.title}</strong>
              <span className="collection-gateway__enter">
                Enter collection <ArrowUpRight size={18} />
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="collection-gateway__footer">
        <span>EbRahaStyle / 2026</span>
        <span>Choose your edit</span>
      </div>
    </main>
  );
}

export default GenderLanding;
