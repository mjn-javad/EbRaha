import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import apiClientBanner from "../../services/api-client_banner";

const BestSellersBanner = ({ gender = "female" }) => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const sortOrder = gender === "female" ? 5 : 6;

  useEffect(() => {
    let mounted = true;
    apiClientBanner
      .get(`/${sortOrder}`)
      .then((response) => {
        const result = response.data?.data || response.data;
        if (mounted) setBanner(Array.isArray(result) ? result[0] : result);
      })
      .catch(() => mounted && setBanner(null))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [sortOrder]);

  if (loading) {
    return (
      <div className="bestseller-editorial bestseller-editorial--loading" />
    );
  }
  if (!banner) return null;

  const imageUrl = banner.image?.startsWith("http")
    ? banner.image
    : `/api/images/banners/${banner.image}`;

  return (
    <section className="bestseller-editorial">
      <Link
        to={`/bestSellers?gender=${gender}`}
        className="bestseller-editorial__media"
      >
        <img src={imageUrl} alt="EbRahaStyle best sellers" />
        <span>Most desired</span>
      </Link>
      <div className="bestseller-editorial__copy">
        <p>EbRaha favourites / 02</p>
        <h2>The pieces everyone is talking about.</h2>
        <span>
          Tried, loved and returned to—the season’s most wanted signatures, all
          in one considered edit.
        </span>
        <Link to={`/bestSellers?gender=${gender}`}>
          Discover best sellers <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
};

export default BestSellersBanner;
