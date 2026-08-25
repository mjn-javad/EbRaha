import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  BadgePercent,
  Boxes,
  ChartNoAxesCombined,
  ChevronLeft,
  ImagePlus,
  Images,
  Menu,
  PackagePlus,
  PanelsTopLeft,
  Percent,
  ReceiptText,
  ShoppingBag,
  Tags,
  Users,
  X,
} from "lucide-react";
import BrandMark from "../Brand/BrandMark";

const navigation = [
  {
    label: "Overview",
    items: [
      {
        title: "Orders",
        to: "/admin/dashboard/orders",
        icon: ReceiptText,
      },
      {
        title: "Shopping carts",
        to: "/admin/dashboard/carts",
        icon: ShoppingBag,
      },
      {
        title: "Customers",
        to: "/admin/dashboard/users-manager",
        icon: Users,
      },
    ],
  },
  {
    label: "Catalogue",
    items: [
      {
        title: "New product",
        to: "/admin/dashboard/product-upload",
        icon: PackagePlus,
      },
      {
        title: "New brand",
        to: "/admin/dashboard/brand-upload",
        icon: Tags,
      },
      {
        title: "Price reductions",
        to: "/admin/dashboard/set-discount-prices",
        icon: Percent,
      },
      {
        title: "Discount codes",
        to: "/admin/dashboard/discount-code-manager",
        icon: BadgePercent,
      },
    ],
  },
  {
    label: "Storefront",
    items: [
      {
        title: "Banners",
        to: "/admin/dashboard/banners",
        icon: Images,
      },
      {
        title: "New banner",
        to: "/admin/dashboard/banner-upload",
        icon: ImagePlus,
      },
    ],
  },
];

const AdminLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="admin-shell">
      <div
        className={`admin-shell__veil ${menuOpen ? "is-visible" : ""}`}
        onClick={closeMenu}
      />

      <aside className={`admin-sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="admin-sidebar__brand">
          <Link to="/women" onClick={closeMenu}>
            <BrandMark inverted compact />
          </Link>
          <button
            type="button"
            className="admin-sidebar__close"
            onClick={closeMenu}
            aria-label="Close admin menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-sidebar__intro">
          <span className="admin-sidebar__signal" />
          <div>
            <p>Private workspace</p>
            <strong>Store control room</strong>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          {navigation.map((section) => (
            <div key={section.label} className="admin-nav-section">
              <p className="admin-nav-section__label">{section.label}</p>
              {section.items.map(({ title, to, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `admin-nav-link ${isActive ? "is-active" : ""}`
                  }
                >
                  {React.createElement(icon, { size: 18, strokeWidth: 1.7 })}
                  <span>{title}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <Link to="/women" className="admin-sidebar__store-link">
          <ChevronLeft size={17} />
          Back to boutique
        </Link>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="admin-topbar__menu"
            aria-label="Open admin menu"
          >
            <Menu size={21} />
          </button>

          <div className="admin-topbar__title">
            <PanelsTopLeft size={18} />
            <span>EbRahaStyle administration</span>
          </div>

          <div className="admin-topbar__status">
            <ChartNoAxesCombined size={17} />
            Live store
          </div>
        </header>

        <main className="admin-page">
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default AdminLayout;
