import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import TrustFeatures from "../components/TrustFeature/TrustFeature";
import TrustFeatures2 from "../components/TrustFeature/TrustFeature2";

const Layout = () => {
  const location = useLocation();

  const isLanding = location.pathname === "/";
  const isAdmin = location.pathname.startsWith("/admin/");

  if (isAdmin) {
    return <Outlet />;
  }

  if (isLanding) {
    return (
      <div className="min-h-screen overflow-hidden bg-[#15110f]">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="site-shell min-h-screen overflow-hidden flex flex-col">
      <NavBar />
      <TrustFeatures />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <TrustFeatures2 />
      <Footer />
    </div>
  );
};

export default Layout;
