import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import apiClientAuth from "../../services/api-client_auth";
import BrandMark from "../Brand/BrandMark";

const adminLinks = [
  ["New Product", "/admin/dashboard/product-upload"],
  ["Orders", "/admin/dashboard/orders"],
  ["Customers", "/admin/dashboard/users-manager"],
  ["Banners", "/admin/dashboard/banners"],
];

const shoeTypes = [
  ["Sneakers", "sneaker"],
  ["Loafers", "loafer"],
  ["Formal", "formal"],
  ["Boots", "boot"],
  ["Sandals", "sandal"],
  ["Sport", "sport"],
  ["Classic", "classic"],
];

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function TopNavbar({ handelOrderPopup }) {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shoesOpen, setShoesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const isMen = useMemo(() => {
    const selectedGender = new URLSearchParams(search).get("gender");

    return (
      pathname === "/men" ||
      selectedGender === "men" ||
      selectedGender === "male"
    );
  }, [pathname, search]);

  const gender = isMen ? "male" : "female";
  const home = isMen ? "/men" : "/women";

  const catalogueLink = (params = {}) => {
    const query = new URLSearchParams({
      gender,
      ...params,
    });

    return `/slider-products?${query.toString()}`;
  };

  const links = [
    [
      "New arrivals",
      catalogueLink({
        sort: "created_at",
        order: "DESC",
      }),
    ],
    ["Shoes", catalogueLink({ type: "shoe" }), "shoe"],
    ["Bags", catalogueLink({ type: "bag" }), "bag"],
    ["Eyewear", catalogueLink({ type: "glasses" }), "glasses"],
    ["Watches", catalogueLink({ type: "watch" }), "watch"],
    ["The sale", catalogueLink({ discountOnly: "true" })],
  ];

  useEffect(() => {
    apiClientAuth
      .get("/me")
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMobileOpen(false);
      setShoesOpen(false);
      setAccountOpen(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [pathname, search]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const logout = async () => {
    const confirmed = window.confirm("Are you sure you want to sign out?");

    if (!confirmed) return;

    try {
      await apiClientAuth.post("/logout");

      setUser(null);
      setAccountOpen(false);
      setMobileOpen(false);

      navigate(home);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (to, type) => {
    const params = new URLSearchParams(search);

    if (type) {
      return pathname === "/slider-products" && params.get("type") === type;
    }

    return `${pathname}${search}` === to;
  };

  return (
    <>
      <div className="announcement-bar">
        <span>Complimentary UAE delivery on selected orders</span>

        <span className="announcement-bar__edition">
          The EbRaha edit · 2026
        </span>
      </div>

      <header className="boutique-header">
        <div className="boutique-header__inner">
          <button
            type="button"
            className="boutique-header__mobile-button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <Link to={home} className="boutique-header__brand">
            <BrandMark />
          </Link>

          <nav className="boutique-nav" aria-label="Main navigation">
            {links.map(([label, to, type]) =>
              label === "Shoes" ? (
                <div key={label} className="boutique-nav__dropdown">
                  <Link
                    to={to}
                    className={cx(
                      "boutique-nav__link",
                      isActive(to, type) && "is-active",
                    )}
                  >
                    {label}

                    <ChevronDown size={13} />
                  </Link>

                  <div className="boutique-nav__menu">
                    <p>Shop shoes</p>

                    {shoeTypes.map(([name, category]) => (
                      <Link
                        key={category}
                        to={catalogueLink({
                          type: "shoe",
                          category,
                        })}
                      >
                        {name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={label}
                  to={to}
                  className={cx(
                    "boutique-nav__link",
                    isActive(to, type) && "is-active",
                  )}
                >
                  {label}
                </Link>
              ),
            )}
          </nav>

          {/* گزینه‌های سمت راست نوبار */}
          <div className="boutique-actions">
            {/* زن و مرد */}
            <div className="gender-switch" aria-label="Collection">
              <Link className={!isMen ? "is-active" : ""} to="/women">
                W
              </Link>

              <Link className={isMen ? "is-active" : ""} to="/men">
                M
              </Link>
            </div>

            {/* حساب کاربری / ادمین */}
            <div className="account-control">
              {loading ? (
                <span className="account-control__loading" />
              ) : user ? (
                <button
                  type="button"
                  onClick={() => setAccountOpen((open) => !open)}
                  aria-label="Account menu"
                  aria-expanded={accountOpen}
                >
                  <UserRound size={20} strokeWidth={1.6} />
                </button>
              ) : (
                <Link to="/LoginLogout" aria-label="Login or register">
                  <UserRound size={20} strokeWidth={1.6} />
                </Link>
              )}

              {accountOpen && user && (
                <div className="account-menu">
                  <p>{user.name || user.username || "Account"}</p>

                  {user.email && <span>{user.email}</span>}

                  {user.role === "admin" &&
                    adminLinks.map(([label, to]) => (
                      <Link key={to} to={to}>
                        {label}
                      </Link>
                    ))}

                  <button type="button" onClick={logout}>
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* سبد خرید */}
            <Link
              to="/basket"
              onClick={handelOrderPopup}
              className="basket-link"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={20} strokeWidth={1.6} />

              <span>Bag</span>
            </Link>
          </div>
        </div>
      </header>

      {/* منوی موبایل */}
      <div className={cx("mobile-navigation", mobileOpen && "is-open")}>
        <button
          type="button"
          className="mobile-navigation__veil"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />

        <aside>
          <div className="mobile-navigation__head">
            <Link
              to={home}
              className="mobile-navigation__brand"
              aria-label="Home"
            >
              <BrandMark />
            </Link>

            <button
              type="button"
              className="mobile-navigation__close"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <div className="mobile-navigation__collections">
            <Link to="/women" className={!isMen ? "is-active" : ""}>
              Women
            </Link>

            <Link to="/men" className={isMen ? "is-active" : ""}>
              Men
            </Link>
          </div>

          <nav className="mobile-navigation__links">
            {links.map(([label, to]) =>
              label === "Shoes" ? (
                <div key={label} className="mobile-navigation__shoes">
                  <button
                    type="button"
                    className="mobile-navigation__shoes-toggle"
                    onClick={() => setShoesOpen((open) => !open)}
                    aria-expanded={shoesOpen}
                  >
                    <span>Shoes</span>

                    <ChevronDown
                      size={18}
                      className={shoesOpen ? "rotate-180" : ""}
                    />
                  </button>

                  {shoesOpen && (
                    <section className="mobile-navigation__shoe-categories">
                      <Link className="mobile-navigation__view-all" to={to}>
                        View all shoes
                      </Link>

                      {shoeTypes.map(([name, category]) => (
                        <Link
                          key={category}
                          to={catalogueLink({
                            type: "shoe",
                            category,
                          })}
                        >
                          {name}
                        </Link>
                      ))}
                    </section>
                  )}
                </div>
              ) : (
                <Link key={label} to={to}>
                  {label}
                </Link>
              ),
            )}

            {user?.role === "admin" && (
              <Link to="/admin/dashboard">Administration</Link>
            )}

            {!user && <Link to="/LoginLogout">Sign in / Register</Link>}
          </nav>

          <div className="mobile-navigation__footer">
            <p>Made With ❤️ By Shairut</p>
          </div>
        </aside>
      </div>
    </>
  );
}
