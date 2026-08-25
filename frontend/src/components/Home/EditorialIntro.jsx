import React from "react";
import { Link } from "react-router-dom";

const EditorialIntro = ({ gender = "female" }) => {
  const isMale = gender === "male";
  const query = `gender=${gender}`;

  return (
    <section className="editorial-intro">
      <div className="editorial-intro__frame">
        <div className="editorial-intro__topline">
          <span>EbRahaStyle</span>
          <span>Collection / {isMale ? "Men" : "Women"}</span>
        </div>

        <div className="editorial-intro__copy">
          <p>{isMale ? "The Men’s Edit" : "The Women’s Edit"}</p>
          <h2>Designed to be noticed. Chosen to endure.</h2>
          <span>
            A refined edit of shoes, bags, eyewear and accessories, selected
            for exceptional craftsmanship, modern character and enduring
            style.
          </span>
          <Link to={`/slider-products?${query}`}>
            Shop the {isMale ? "men’s" : "women’s"} collection
          </Link>
        </div>

        <div className="editorial-intro__footerline">
          <span>Selected for the UAE</span>
          <span>Private Edit · 01</span>
        </div>
      </div>
    </section>
  );
};

export default EditorialIntro;
