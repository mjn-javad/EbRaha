import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClientBrand from "../../services/api-client";

const formatBrand = (name) =>
  String(name || "")
    .trim()
    .split(/\s+/)
    .map((word, index) => {
      const clean = word.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      return index === 0
        ? clean
        : clean.charAt(0).toUpperCase() + clean.slice(1);
    })
    .join("");

const BrandScroller = ({
  brands: receivedBrands,
  navigatePath = "/slider-products",
  defaultType = "",
}) => {
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState("");
  const railRef = useRef(null);
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const gender = useMemo(() => {
    const selected = new URLSearchParams(search).get("gender")?.toLowerCase();
    if (selected === "male" || selected === "men") return "male";
    if (selected === "female" || selected === "women") return "female";
    return pathname.startsWith("/men") ? "male" : "female";
  }, [pathname, search]);

  useEffect(() => {
    if (Array.isArray(receivedBrands)) {
      const timer = window.setTimeout(() => {
        setBrands(receivedBrands);
        setError("");
      }, 0);
      return () => window.clearTimeout(timer);
    }

    apiClientBrand
      .get("")
      .then((response) => {
        setBrands(response.data?.data || []);
        setError("");
      })
      .catch(() => {
        setBrands([]);
        setError("Brands are temporarily unavailable");
      });
    return undefined;
  }, [receivedBrands]);

  const selectBrand = (brand) => {
    const params = new URLSearchParams(search);
    params.set("gender", gender);
    if (defaultType && !params.get("type")) params.set("type", defaultType);
    params.set("brand", brand.slug || formatBrand(brand.name));
    navigate(`${navigatePath}?${params.toString()}`);
  };

  const move = (direction) => {
    railRef.current?.scrollBy({ left: direction * 360, behavior: "smooth" });
  };

  if (!brands.length && !error) return null;

  return (
    <section className="brand-edit">
      <div className="brand-edit__head">
        <div>
          <p>Designer index</p>
          <h2>House names & new discoveries</h2>
        </div>
        <div>
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous brands"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next brands"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {error ? (
        <p className="brand-edit__error">{error}</p>
      ) : (
        <div ref={railRef} className="brand-edit__rail">
          {brands.map((brand, index) => (
            <button
              key={brand.id || brand.slug || `${brand.name}-${index}`}
              type="button"
              onClick={() => selectBrand(brand)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{brand.name}</strong>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default BrandScroller;
