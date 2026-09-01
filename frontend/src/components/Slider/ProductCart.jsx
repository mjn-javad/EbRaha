import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { getProductImageUrl } from "../../utils/productImage";

const getProductImage = (product, index = 0, size = 640) => {
  return getProductImageUrl(product?.images?.[index], size);
};

const ProductCard = ({
  products: initialProducts,
  header = "The collection",
  title = "Explore all pieces",
  navigateLink,
  scrollOnMobile = false,
  scrollOnLaptop = false,
  infiniteScroll = true,
  apiUrl = "/api/v1/products",
  limit = 20,
}) => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState(initialProducts || []);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  const railRef = useRef(null);

  useEffect(() => {
    setProducts(initialProducts || []);
    setPage(1);
    setTotalPages(null);
  }, [initialProducts]);

  useEffect(
    () => () => {
      observerRef.current?.disconnect();
    },
    [],
  );

  const fetchMoreProducts = useCallback(async () => {
    if (!infiniteScroll || loading || (totalPages && page >= totalPages))
      return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const params = new URLSearchParams(searchParams);
      params.set("page", nextPage);
      params.set("limit", limit);
      const separator = apiUrl.includes("?") ? "&" : "?";
      const response = await fetch(`${apiUrl}${separator}${params.toString()}`);
      const result = await response.json();

      setProducts((current) => [...current, ...(result.data || [])]);
      setPage(result.pagination?.page || nextPage);
      setTotalPages(result.pagination?.totalPages || null);
    } catch (error) {
      console.error("Product infinite scroll error:", error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, infiniteScroll, limit, loading, page, searchParams, totalPages]);

  const lastProductRef = useCallback(
    (node) => {
      if (!infiniteScroll || loading) return;
      observerRef.current?.disconnect();
      observerRef.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) fetchMoreProducts();
      });
      if (node) observerRef.current.observe(node);
    },
    [fetchMoreProducts, infiniteScroll, loading],
  );

  const isRail = scrollOnMobile || scrollOnLaptop;
  const moveRail = (direction) => {
    railRef.current?.scrollBy({
      left: direction * Math.min(420, window.innerWidth * 0.78),
      behavior: "smooth",
    });
  };

  return (
    <section className="product-showcase">
      <div className="product-showcase__head">
        <div>
          <p>{title}</p>
          <h2>{header}</h2>
        </div>
        <div className="product-showcase__actions">
          {isRail && (
            <div className="product-showcase__arrows">
              <button
                type="button"
                onClick={() => moveRail(-1)}
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => moveRail(1)}
                aria-label="Next"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
          {navigateLink && (
            <Link to={navigateLink}>
              View the edit <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>

      <div
        ref={railRef}
        className={`product-grid ${isRail ? "product-grid--rail" : ""}`}
      >
        {products.map((product, index) => {
          const productId = product._id || product.id;
          const price = Number(product.price);
          const discountedPrice = Number(product.discount_price);
          const hasDiscount =
            discountedPrice > 0 && price > 0 && discountedPrice < price;
          const discount = hasDiscount
            ? Math.round(((price - discountedPrice) / price) * 100)
            : null;
          const primaryImage = getProductImage(product);
          const secondaryImage = getProductImage(product, 1);

          return (
            <Link
              key={productId || index}
              ref={
                infiniteScroll && index === products.length - 1
                  ? lastProductRef
                  : null
              }
              to={`/product/${productId}`}
              className="product-tile"
            >
              <div className="product-tile__media">
                {primaryImage ? (
                  <>
                    <img
                      src={primaryImage}
                      alt={product.name}
                      loading="lazy"
                      className="product-tile__image"
                    />
                    {secondaryImage && (
                      <img
                        src={secondaryImage}
                        alt=""
                        loading="lazy"
                        className="product-tile__image product-tile__image--alternate"
                      />
                    )}
                  </>
                ) : (
                  <div className="product-tile__placeholder">
                    <ShoppingBag size={38} strokeWidth={1} />
                  </div>
                )}

                <span className="product-tile__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {discount && (
                  <span className="product-tile__discount">−{discount}%</span>
                )}
                <span className="product-tile__discover">Discover</span>
              </div>

              <div className="product-tile__details">
                <p>{product.brand || "EbRaha selection"}</p>
                <h3>{product.name}</h3>
                <div className="product-tile__price">
                  {price === 1 ? (
                    <strong>Price via WhatsApp</strong>
                  ) : hasDiscount ? (
                    <>
                      <strong>{discountedPrice.toLocaleString()} AED</strong>
                      <del>{price.toLocaleString()} AED</del>
                    </>
                  ) : (
                    <strong>{price.toLocaleString()} AED</strong>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {infiniteScroll && loading && (
        <div className="product-showcase__loading">Curating more pieces…</div>
      )}

      {!products.length && !loading && (
        <div className="product-showcase__empty">
          <ShoppingBag size={34} strokeWidth={1} />
          <h3>No pieces found</h3>
          <p>Try a different category or return to the complete edit.</p>
        </div>
      )}
    </section>
  );
};

export default ProductCard;
