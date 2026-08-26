import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClientBanner from "../../services/api-client_banner";

const IMAGE_BASE_URL = "/api/images/banners/";

const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${IMAGE_BASE_URL}${image}`;
};

const isExternalLink = (link) => {
  if (!link) return false;

  return (
    link.startsWith("http://") ||
    link.startsWith("https://") ||
    link.startsWith("tel:") ||
    link.startsWith("mailto:")
  );
};

const BannerButton = ({ title, link, secondary = false }) => {
  if (!title || !link) return null;

  const className = secondary
    ? `
        flex
        h-12
        items-center
        justify-center
        border
        border-white
        text-xs
        uppercase
        tracking-[0.28em]
        text-white
        transition-all
        duration-300
        hover:bg-white
        hover:text-black
        sm:text-sm
        lg:border-black
        lg:text-black
        lg:hover:bg-black
        lg:hover:text-white
      `
    : `
        flex
        h-12
        items-center
        justify-center
        bg-black
        text-xs
        uppercase
        tracking-[0.28em]
        text-white
        transition-all
        duration-300
        hover:bg-zinc-800
        sm:text-sm
      `;

  if (isExternalLink(link)) {
    return (
      <a href={link} target="_blank" rel="noreferrer" className={className}>
        {title}
      </a>
    );
  }

  return (
    <Link to={link} className={className}>
      {title}
    </Link>
  );
};

const GlobalBanner = ({ mobileSortOrder, laptopSortOrder }) => {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showText, setShowText] = useState(false);

  const sort_order = isMobile ? mobileSortOrder : laptopSortOrder;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (sort_order === undefined || sort_order === null) {
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
      .get(`/${sort_order}`)
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
          if (!banner?.image) return;

          const image = new Image();
          image.src = getImageUrl(banner.image);
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
  }, [sort_order]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((previousIndex) => {
        return (previousIndex + 1) % banners.length;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length === 0) return;

    const hideTimer = window.setTimeout(() => setShowText(false), 0);

    const timer = setTimeout(() => {
      setShowText(true);
    }, 700);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(timer);
    };
  }, [currentIndex, banners.length]);

  const handleBannerClick = (event) => {
    const currentBanner = banners[currentIndex];

    if (!currentBanner?.bannerLink) return;

    if (event.target.closest("a")) return;
    if (event.target.closest("button")) return;

    if (isExternalLink(currentBanner.bannerLink)) {
      window.open(currentBanner.bannerLink, "_blank", "noopener,noreferrer");
      return;
    }

    navigate(currentBanner.bannerLink);
  };

  const handleDotClick = (event, index) => {
    event.preventDefault();
    event.stopPropagation();

    if (index === currentIndex) return;

    setCurrentIndex(index);
  };

  if (sort_order === undefined || sort_order === null) return null;

  if (loading) {
    return (
      <section className="campaign-banner campaign-banner--loading">
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

  const hasButtons =
    (currentBanner.btnTitle1 && currentBanner.btnLink1) ||
    (currentBanner.btnTitle2 && currentBanner.btnLink2);

  return (
    <section
      className={`campaign-banner ${currentBanner.bannerLink ? "cursor-pointer" : ""}`}
      onClick={handleBannerClick}
    >
      {banners.map((banner, index) => (
        <img
          key={banner.id || index}
          src={getImageUrl(banner.image)}
          alt={banner.title1 || banner.title2 || "Modern Luxury Banner"}
          className={`campaign-banner__image
            ${
              index === currentIndex
                ? "scale-100 opacity-100"
                : "scale-[1.02] opacity-0"
            }
          `}
        />
      ))}

      <div className="campaign-banner__overlay" />

      <div className="campaign-banner__content">
        <div>
          <div
            className={`
              campaign-banner__copy
              transition-all
              duration-700
              ease-out
              ${
                showText
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-6 opacity-0"
              }
            `}
          >
            {currentBanner.title1 && (
              <h1>{currentBanner.title1.replace(/\\n/g, "\n")}</h1>
            )}

            {currentBanner.title2 && (
              <p>{currentBanner.title2.replace(/\\n/g, "\n")}</p>
            )}

            {hasButtons && (
              <div className="campaign-banner__buttons">
                <BannerButton
                  title={currentBanner.btnTitle1}
                  link={currentBanner.btnLink1}
                />

                <BannerButton
                  title={currentBanner.btnTitle2}
                  link={currentBanner.btnLink2}
                  secondary
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {banners.length > 1 && (
        <div className="campaign-banner__dots">
          {banners.map((banner, index) => (
            <button
              key={banner.id || index}
              type="button"
              aria-label={`نمایش بنر ${index + 1}`}
              onClick={(event) => handleDotClick(event, index)}
              className={`
                h-2
                rounded-full
                transition-all
                duration-300
                ${
                  index === currentIndex
                    ? "w-8 bg-white shadow-md"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }
              `}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default GlobalBanner;
