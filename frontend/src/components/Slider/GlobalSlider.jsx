import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import apiClientPpoducts from "../../services/api-client_products";
import ProductCard from "./ProductCart";
import BrandScroller from "../HorizentalScroll/BrandScroller";

const GlobalSlider = ({
  myQuery = "",
  header,
  title,
  navigateLink,
  limit,
  scrollOnMobile = false,
  scrollOnLaptop = false,
  pagination = false,
  pageSize = 8,
  mobilePageSize = 9,
}) => {
  const [isMobileGrid, setIsMobileGrid] = useState(() =>
    window.matchMedia("(max-width: 680px)").matches,
  );
  const [requestState, setRequestState] = useState({
    key: "",
    products: [],
    brands: [],
    paginationInfo: null,
    error: "",
  });

  const { search } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedPage = pagination
    ? Math.max(Number.parseInt(searchParams.get("page") || "1", 10) || 1, 1)
    : 1;
  const sortField = searchParams.get("sort") || "created_at";
  const sortOrder = searchParams.get("order") === "ASC" ? "ASC" : "DESC";
  const sortValue = `${sortField}:${sortOrder}`;
  const effectivePageSize = isMobileGrid ? mobilePageSize : pageSize;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 680px)");
    const handleGridChange = (event) => setIsMobileGrid(event.matches);

    mediaQuery.addEventListener("change", handleGridChange);
    return () => mediaQuery.removeEventListener("change", handleGridChange);
  }, []);

  const requestQuery = useMemo(() => {
    const [path, queryString = ""] = myQuery.split("?");

    const params = new URLSearchParams(queryString);
    const currentParams = new URLSearchParams(search);

    currentParams.forEach((value, key) => {
      params.set(key, value);
    });

    if (pagination) {
      params.set("page", requestedPage);
      params.set("limit", effectivePageSize);
    }

    const finalQuery = params.toString();
    return finalQuery ? `${path}?${finalQuery}` : path;
  }, [effectivePageSize, myQuery, pagination, requestedPage, search]);

  const hasCurrentResponse = requestState.key === requestQuery;
  const products = hasCurrentResponse ? requestState.products : [];
  const brands = hasCurrentResponse ? requestState.brands : [];
  const paginationInfo = hasCurrentResponse
    ? requestState.paginationInfo
    : null;
  const error = hasCurrentResponse ? requestState.error : "";
  const loading = !hasCurrentResponse;

  useEffect(() => {
    let isMounted = true;

    apiClientPpoducts
      .get(requestQuery)
      .then((res) => {
        if (!isMounted) return;

        setRequestState({
          key: requestQuery,
          products: res.data?.data || [],
          brands: res.data?.brands || [],
          paginationInfo: pagination
            ? {
                total: Number(res.data?.pagination?.total) || 0,
                page: Number(res.data?.pagination?.page) || requestedPage,
                limit:
                  Number(res.data?.pagination?.limit) || effectivePageSize,
                totalPages: Number(res.data?.pagination?.totalPages) || 0,
              }
            : null,
          error: "",
        });
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error(err);
        setRequestState({
          key: requestQuery,
          products: [],
          brands: [],
          paginationInfo: null,
          error:
            err.response?.data?.message ||
            "The products are temporarily unavailable. Please try again.",
        });
      });

    return () => {
      isMounted = false;
    };
  }, [effectivePageSize, pagination, requestQuery, requestedPage]);

  const updateListingParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    setSearchParams(nextParams);
  };

  const handlePageChange = (nextPage) => {
    updateListingParams({ page: nextPage === 1 ? null : nextPage });
  };

  const handleSortChange = (nextSortValue) => {
    const [sort, order] = nextSortValue.split(":");
    updateListingParams({ sort, order, page: null });
  };

  return (
    <div className="global-slider">
      {limit === undefined && <BrandScroller brands={brands} />}

      <ProductCard
        products={products}
        header={header}
        title={title}
        navigateLink={navigateLink}
        scrollOnMobile={scrollOnMobile}
        scrollOnLaptop={scrollOnLaptop}
        pagination={pagination ? paginationInfo : null}
        onPageChange={pagination ? handlePageChange : undefined}
        sortValue={sortValue}
        onSortChange={pagination ? handleSortChange : undefined}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default GlobalSlider;
