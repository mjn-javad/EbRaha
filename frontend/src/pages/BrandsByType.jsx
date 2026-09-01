import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClientBrand from "../services/api-client_brand";

const typeLabels = {
  shoe: "Shoes",
  bag: "Bags",
  glasses: "Eyewear",
  luggage: "Luggage",
  clothes: "Clothes",
  accessories: "Accessories",
  watch: "Watches",
  limited_edition: "Limited Edition",
};

const getBrandImageUrl = (image) => {
  if (!image) return "";
  return image.startsWith("http") ? image : `/api/images/barnds/${image}`;
};

const getBrandInitials = (name) =>
  String(name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const BrandsByType = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [requestState, setRequestState] = useState({
    key: "",
    brands: [],
    error: "",
  });

  const type = String(searchParams.get("type") || "").toLowerCase();
  const gender = String(searchParams.get("gender") || "").toLowerCase();
  const isMale = gender === "male" || gender === "men";
  const genderLabel = isMale ? "Men's" : "Women's";
  const typeLabel = typeLabels[type] || "Collection";
  const requestKey = `${type}|${gender}`;
  const hasCurrentResponse = requestState.key === requestKey;
  const brands = hasCurrentResponse ? requestState.brands : [];
  const error = !type
    ? "No product type was selected"
    : hasCurrentResponse
      ? requestState.error
      : "";
  const loading = Boolean(type) && !hasCurrentResponse;

  const backPath = useMemo(() => (isMale ? "/men" : "/women"), [isMale]);

  useEffect(() => {
    let isMounted = true;

    if (!type) {
      return undefined;
    }

    apiClientBrand
      .get("/by-product-type", {
        params: {
          type,
          ...(gender ? { gender } : {}),
        },
      })
      .then((response) => {
        if (!isMounted) return;
        const result = response.data?.data;
        setRequestState({
          key: requestKey,
          brands: Array.isArray(result) ? result : [],
          error: "",
        });
      })
      .catch((requestError) => {
        if (!isMounted) return;
        setRequestState({
          key: requestKey,
          brands: [],
          error:
            requestError.response?.data?.message ||
            "Brands are temporarily unavailable",
        });
      });

    return () => {
      isMounted = false;
    };
  }, [type, gender, requestKey]);

  const openBrandProducts = (brandSlug) => {
    const params = new URLSearchParams();
    params.set("type", type);
    params.set("brand", brandSlug);
    if (gender) params.set("gender", gender);
    navigate(`/slider-products?${params.toString()}`);
  };

  return (
    <main className="brand-selection">
      <button
        type="button"
        className="brand-selection__back"
        onClick={() => navigate(backPath)}
      >
        <ArrowLeft size={17} />
        Back to {isMale ? "men" : "women"}
      </button>

      <header className="brand-selection__head">
        <p>{genderLabel} collection</p>
        <h1>{typeLabel} by brand</h1>
        <span>
          Choose a house to explore all of its {typeLabel.toLowerCase()}.
        </span>
      </header>

      {error && <p className="brand-selection__message">{error}</p>}

      {loading && (
        <div className="brand-selection__grid" aria-label="Loading brands">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="brand-selection__skeleton"
              aria-hidden="true"
            />
          ))}
        </div>
      )}

      {!loading && !error && brands.length === 0 && (
        <div className="brand-selection__empty">
          <ImageIcon size={34} strokeWidth={1.2} />
          <h2>No brands found</h2>
          <p>No brand currently has products in this category.</p>
        </div>
      )}

      {!loading && brands.length > 0 && (
        <div className="brand-selection__grid">
          {brands.map((brand) => (
            <button
              key={brand.id || brand.slug}
              type="button"
              className="brand-selection__card"
              onClick={() => openBrandProducts(brand.slug)}
            >
              <span className="brand-selection__media">
                {brand.image ? (
                  <img
                    src={getBrandImageUrl(brand.image)}
                    alt={`${brand.name} logo`}
                  />
                ) : (
                  <span
                    className="brand-selection__initials"
                    aria-hidden="true"
                  >
                    {getBrandInitials(brand.name)}
                  </span>
                )}
              </span>

              <span className="brand-selection__copy">
                <span>
                  <strong>{brand.name}</strong>
                  <small>
                    {Number(brand.product_count) || 0} collection
                    {Number(brand.product_count) === 1 ? "" : "s"}
                  </small>
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </main>
  );
};

export default BrandsByType;
