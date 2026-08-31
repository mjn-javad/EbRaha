import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";
import WomenHome from "./pages/WomanHome";
import MenHome from "./pages/ManHome";

import ProductUploader from "./components/Uploader/ProductUploader";
import BrandUploader from "./components/Uploader/BrandUploader";
import BannerUploader from "./components/Uploader/BannerUploader";

import Login from "./components/Login/Login";
import Register from "./components/Login/Register";
import VerifyCode from "./components/Login/VerifyCode";
import ForgotPassword from "./components/Login/ForgotPassword";
import ResetPassword from "./components/Login/ResetPassword";

import SingleProduct from "./components/Slider/SingleProduct";
import SliderProducts from "./components/Slider/SliderProducts";
import SliderNewArrivels from "./components/Slider/SliderNewArrivels";

import Basket from "./components/Basket/Basket";
import AddressPage from "./components/AddressPage/AddressPage";

import AdminProductsManagement from "./components/AdminProductsManager/AdminProductsManager";
import AdminSingleProductManagement from "./components/AdminProductsManager/AdminSingleProductManagment";
import UserManagement from "./components/UserManagment/UserManagment";
import SimpleAllCarts from "./components/SimpleAllCarts";
import CompletedOrdersPage from "./components/CompletedOrdersPage";

import DiscountPriceSetter from "./components/Discount/DiscountPriceSetter";
import DiscountCodeManager from "./components/Discount/DiscountCodeManager";

import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import "./App.css";
import BannerManager from "./components/Banner/BannerManager";
import EditBanner from "./components/Banner/EditBanner";
import BestSellersGlobalSlider from "./components/Slider/BestSellersGlobalSlider";
import GenderLanding from "./pages/GenderLanding";
import AdminLayout from "./components/Admin/AdminLayout";
import BrandManager from "./components/Brand/BrandManager";
import EditBrand from "./components/Brand/EditBrand";

function App() {
  return (
    <>
      {" "}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Home Pages */}
          <Route index element={<GenderLanding />} />
          <Route path="women" element={<WomenHome />} />
          <Route path="men" element={<MenHome />} />

          {/* Product Pages */}
          <Route path="product/:id" element={<SingleProduct />} />
          <Route path="slider-products" element={<SliderProducts />} />
          <Route path="new-arrivals" element={<SliderNewArrivels />} />
          <Route path="bestSellers" element={<BestSellersGlobalSlider />} />

          {/* Auth Pages */}
          <Route path="LoginLogout" element={<Login />} />
          <Route path="verify" element={<VerifyCode />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />

          {/* User Pages */}
          <Route path="basket" element={<Basket />} />
          <Route path="address" element={<AddressPage />} />

          {/* Admin Dashboard */}
          <Route path="admin/dashboard" element={<AdminLayout />}>
            <Route index element={<AdminProductsManagement />} />
            <Route
              path="products-manager"
              element={<AdminProductsManagement />}
            />
            <Route
              path="editProduct/:productId"
              element={<AdminSingleProductManagement />}
            />
            <Route path="users-manager" element={<UserManagement />} />
            <Route path="carts" element={<SimpleAllCarts />} />
            <Route path="orders" element={<CompletedOrdersPage />} />
            <Route path="brand-upload" element={<BrandUploader />} />
            <Route path="brands" element={<BrandManager />} />
            <Route path="editBrand/:id" element={<EditBrand />} />
            <Route path="product-upload" element={<ProductUploader />} />
            <Route
              path="product-upload/:productId"
              element={<ProductUploader />}
            />
            <Route path="banner-upload" element={<BannerUploader />} />
            <Route
              path="set-discount-prices"
              element={<DiscountPriceSetter />}
            />
            <Route
              path="discount-code-manager"
              element={<DiscountCodeManager />}
            />
            <Route path="banners" element={<BannerManager />} />
            <Route path="editBanner/:id" element={<EditBanner />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
