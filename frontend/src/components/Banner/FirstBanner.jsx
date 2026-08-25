import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClientBanner from "../../services/api-client_banner";

const IMAGE_BASE_URL = "http://localhost:4000/images/banners/";

const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  return `${IMAGE_BASE_URL}${image}`;
};

const FirstBanner = ({ gender }) => {
  const navigate = useNavigate();

  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showText, setShowText] = useState(false);

  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia("(min-width: 1024px)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleScreenChange = (event) => {
      setIsDesktop(event.matches);
    };

    mediaQuery.addEventListener("change", handleScreenChange);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenChange);
    };
  }, []);

  const getSortOrder = () => {
    if (gender === "female") {
      return isDesktop ? 2 : 1;
    }

    if (gender === "male") {
      return isDesktop ? 4 : 3;
    }

    return null;
  };

  const sortOrder = getSortOrder();

  useEffect(() => {
    if (!sortOrder) {
      return;
    }

    let isMounted = true;

    const resetTimer = window.setTimeout(() => {
      if (!isMounted) return;
      setLoading(true);
      setError("");
      setCurrentIndex(0);
      setShowText(false);
    }, 0);

    apiClientBanner
      .get(`/${sortOrder}`)
      .then((res) => {
        const result = res.data?.data || res.data;

        const finalBanners = Array.isArray(result)
          ? result
          : result
            ? [result]
            : [];

        if (!isMounted) return;

        setBanners(finalBanners);

        finalBanners.forEach((banner) => {
          if (banner?.image) {
            const image = new Image();
            image.src = getImageUrl(banner.image);
          }
        });
      })
      .catch((err) => {
        console.log("Get banner error:", err);

        if (isMounted) {
          setError("خطا در دریافت اطلاعات بنر");
          setBanners([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      window.clearTimeout(resetTimer);
    };
  }, [sortOrder]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((previousIndex) => (previousIndex + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length === 0) return;

    const hideTimer = window.setTimeout(() => setShowText(false), 0);

    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 700);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(textTimer);
    };
  }, [currentIndex, banners.length]);

  const handleBannerClick = (event) => {
    const currentBanner = banners[currentIndex];

    if (!currentBanner?.bannerLink) return;

    if (event.target.closest("a")) return;
    if (event.target.closest("[data-banner-dot]")) return;

    navigate(currentBanner.bannerLink);
  };

  const handleDotClick = (event, index) => {
    event.preventDefault();
    event.stopPropagation();

    if (index === currentIndex) return;

    setCurrentIndex(index);
  };

  if (!sortOrder) return null;

  if (loading) {
    return (
      <section className="home-hero home-hero--loading">
        <div />
      </section>
    );
  }

  if (error || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  if (!currentBanner) {
    return null;
  }

  const hasButtons = currentBanner.btnTitle1 || currentBanner.btnTitle2;

  return (
    <section
      className="home-hero"
      onClick={handleBannerClick}
    >
      {banners.map((banner, index) => (
        <img
          key={banner.id || index}
          src={getImageUrl(banner.image)}
          alt={banner.title1 || banner.title2 || "Modern Luxury Banner"}
          className={`home-hero__image ${
            index === currentIndex
              ? "opacity-100 scale-100"
              : "opacity-0 scale-[1.02]"
          }`}
        />
      ))}

      <div className="home-hero__overlay" />

      <div className="home-hero__content">
        <div className="home-hero__content-inner">
          <div
            className={`home-hero__copy transition-all duration-700 ease-out ${
              showText
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-6"
            }`}
          >
            {currentBanner.title1 && (
              <h1>
                {currentBanner.title1.replace(/\\n/g, "\n")}
              </h1>
            )}

            {currentBanner.title2 && (
              <p>
                {currentBanner.title2.replace(/\\n/g, "\n")}
              </p>
            )}

            {hasButtons && (
              <div className="home-hero__buttons">
                {currentBanner.btnTitle1 && (
                  <Link
                    to={currentBanner.btnLink1 || "#"}
                    className="home-hero__button home-hero__button--primary"
                  >
                    {currentBanner.btnTitle1}
                  </Link>
                )}

                {currentBanner.btnTitle2 && (
                  <Link
                    to={currentBanner.btnLink2 || "#"}
                    className="home-hero__button home-hero__button--secondary"
                  >
                    {currentBanner.btnTitle2}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {banners.length > 1 && (
        <div className="home-hero__dots">
          {banners.map((banner, index) => (
            <button
              key={banner.id || index}
              type="button"
              data-banner-dot
              aria-label={`نمایش بنر ${index + 1}`}
              onClick={(event) => handleDotClick(event, index)}
              className={`${
                index === currentIndex
                  ? "is-active"
                  : ""
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FirstBanner;
