import React, { useEffect, useState } from "react";
import apiClientBrandPopular from "../../services/api-client";
import apiClientBanner from "../../services/api-client_banner";
import ProductCard from "./ProductCart";

const IMAGE_BASE_URL = "/api/images/banners/";

const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${IMAGE_BASE_URL}${image}`;
};

const NewArivelsGlobalSlider = ({
  myQuery = "",
  header,
  title,
  navigateLink,
  limit,
}) => {
  const [shoes, setShoes] = useState([]);
  const [banner, setBanner] = useState(null);
  const [error, setError] = useState("");

  const BigSizeBannerStOrd = 11;

  useEffect(() => {
    let isMounted = true;

    const fetchShoes = async () => {
      try {
        const shoesRes = await apiClientBrandPopular.get(
          `/newArrivels${myQuery}`,
        );

        if (isMounted) {
          setShoes(shoesRes.data?.data || []);
          setError("");
        }
      } catch (err) {
        console.error("New arrivals request error:", err);

        if (isMounted) {
          setShoes([]);
          setError("Failed to load new arrivals");
        }
      }
    };

    const fetchBanner = async () => {
      try {
        const bannerRes = await apiClientBanner.get(`/${BigSizeBannerStOrd}`);
        const bannerResult = bannerRes.data?.data || bannerRes.data;

        const selectedBanner = Array.isArray(bannerResult)
          ? bannerResult[0] || null
          : bannerResult || null;

        if (isMounted) {
          setBanner(selectedBanner);
        }
      } catch (err) {
        console.error("Banner request error:", err);

        if (isMounted) {
          setBanner(null);
        }
      }
    };

    fetchShoes();
    fetchBanner();

    return () => {
      isMounted = false;
    };
  }, [myQuery]);

  return (
    <div className="global-slider">
      {error && (
        <p className="my-4 text-center text-sm text-red-500">{error}</p>
      )}

      {banner?.image && (
        <div className="mb-0 w-full overflow-hidden rounded-2xl lg:aspect-[16/5]">
          <img
            src={getImageUrl(banner.image)}
            alt={banner.title1 || "New arrivals banner"}
            className="
        block
        h-auto
        w-full
        lg:h-full
        lg:object-cover
        lg:object-center
      "
            onError={(event) => {
              console.error("Banner image failed:", event.currentTarget.src);
            }}
          />
        </div>
      )}
      <ProductCard
        products={shoes}
        header={header}
        title={title}
        navigateLink={navigateLink}
        apiUrl={`/api/v1/brandPopular/newArrivels${myQuery}`}
        limit={limit}
        infiniteScroll={false}
        scrollOnMobile={true}
        scrollOnLaptop={true}
      />
    </div>
  );
};

export default NewArivelsGlobalSlider;
