import React, { useRef } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getProductImageUrl } from "../../utils/productImage";

const getProductImage = (product, index = 0, size = 640) => {
  return getProductImageUrl(product?.images?.[index], size);
};

const getPaginationItems = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "end-ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "start-ellipsis",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "start-ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "end-ellipsis",
    totalPages,
  ];
};

const ProductCard = ({
  products: initialProducts,
  header = "The collection",
  title = "Explore all pieces",
  navigateLink,
  scrollOnMobile = false,
  scrollOnLaptop = false,
  pagination = null,
  onPageChange,
  sortValue = "created_at:DESC",
  onSortChange,
  loading = false,
  error = "",
}) => {
  const products = Array.isArray(initialProducts) ? initialProducts : [];
  const railRef = useRef(null);
  const currentPage = Math.max(Number(pagination?.page) || 1, 1);
  const totalPages = Math.max(Number(pagination?.totalPages) || 0, 0);
  const totalProducts = Math.max(Number(pagination?.total) || 0, 0);
  const pageSize = Math.max(Number(pagination?.limit) || products.length || 1, 1);
  const paginationItems = getPaginationItems(currentPage, totalPages);

  const isRail = scrollOnMobile || scrollOnLaptop;
  const moveRail = (direction) => {
    railRef.current?.scrollBy({
      left: direction * Math.min(420, window.innerWidth * 0.78),
      behavior: "smooth",
    });
  };

  const changePage = (nextPage) => {
    if (
      !onPageChange ||
      loading ||
      nextPage < 1 ||
      nextPage > totalPages ||
      nextPage === currentPage
    ) {
      return;
    }

    onPageChange(nextPage);
  };

  return (
    <section className="product-showcase">
      <div className="product-showcase__head">
        <div>
          <p>{title}</p>
          <h2>{header}</h2>
        </div>
        <div className="product-showcase__actions">
          {pagination && (
            <div className="product-showcase__listing-controls">
              <span>
                {totalProducts} Product{totalProducts === 1 ? "" : "s"}
              </span>
              {onSortChange && (
                <label className="product-showcase__sort">
                  <span>Sort</span>
                  <select
                    aria-label="Sort products"
                    value={sortValue}
                    onChange={(event) => onSortChange(event.target.value)}
                    disabled={loading}
                  >
                    <option value="created_at:DESC">Newest</option>
                    <option value="price:ASC">Price: low to high</option>
                    <option value="price:DESC">Price: high to low</option>
                    <option value="name:ASC">Name: A to Z</option>
                  </select>
                  <ChevronDown size={15} aria-hidden="true" />
                </label>
              )}
            </div>
          )}
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
        aria-busy={loading}
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
              to={`/product/${productId}`}
              className="product-tile"
            >
              <div
                className={`product-tile__media${
                  secondaryImage
                    ? " product-tile__media--has-alternate"
                    : ""
                }`}
              >
                {primaryImage ? (
                  <>
                    <img
                      src={primaryImage}
                      alt={product.name}
                      loading="lazy"
                      className="product-tile__image product-tile__image--primary"
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
                  {String(
                    pagination
                      ? (currentPage - 1) * pageSize + index + 1
                      : index + 1,
                  ).padStart(2, "0")}
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

      {loading && (
        <div className="product-showcase__loading" role="status">
          Curating the collection…
        </div>
      )}

      {error && !loading && (
        <div className="product-showcase__empty" role="alert">
          <ShoppingBag size={34} strokeWidth={1} />
          <h3>Unable to load this collection</h3>
          <p>{error}</p>
        </div>
      )}

      {!products.length && !loading && !error && (
        <div className="product-showcase__empty">
          <ShoppingBag size={34} strokeWidth={1} />
          <h3>No pieces found</h3>
          <p>Try a different category or return to the complete edit.</p>
        </div>
      )}

      {pagination && totalPages > 0 && !error && (
        <nav className="product-pagination" aria-label="Product pages">
          <button
            type="button"
            className="product-pagination__arrow"
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            aria-label="Previous product page"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="product-pagination__pages">
            {paginationItems.map((item) =>
              typeof item === "number" ? (
                <button
                  key={item}
                  type="button"
                  className={item === currentPage ? "is-active" : ""}
                  onClick={() => changePage(item)}
                  disabled={loading}
                  aria-label={`Go to product page ${item}`}
                  aria-current={item === currentPage ? "page" : undefined}
                >
                  {item}
                </button>
              ) : (
                <span key={item} aria-hidden="true">
                  …
                </span>
              ),
            )}
          </div>

          <button
            type="button"
            className="product-pagination__arrow"
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            aria-label="Next product page"
          >
            <ChevronRight size={18} />
          </button>

          <span className="product-pagination__summary">
            Page {currentPage} of {totalPages}
          </span>
        </nav>
      )}
    </section>
  );
};

export default ProductCard;
