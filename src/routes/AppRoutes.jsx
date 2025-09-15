import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginAdmin from "../containers/loginAdmin/LoginAdmin";
import AdminLayout from "../containers/admin/Admin";
import Dashboard from "../containers/admin/main/content/dashboard/Dashboard";
import Orders from "../containers/admin/main/content/orders/Orders";
import Products from "../containers/admin/main/content/products/Products";
import Users from "../containers/admin/main/content/users/Users";
import AddUser from "../containers/admin/main/content/addUser/AddUser";
import Client from "../containers/client/Client";
import HomePage from "../containers/client/mainClient/home/HomePage";
import ProductPage from "../containers/client/mainClient/product/ProductPage";
import BlogPage from "../containers/client/mainClient/blog/BlogPage";
import AboutPage from "../containers/client/mainClient/about/AboutPage";
import StorePage from "../containers/client/mainClient/store/StorePage";
import LoginPage from "../containers/client/mainClient/login/LoginPage";
import Register from "../containers/client/mainClient/register/Register";
import DetailBlog from "../containers/client/mainClient/detailblog/DetailBlog";
import ForgotPassword from "../containers/client/mainClient/forgotpassword/ForgotPassword";
import VerifyOTP from "../containers/client/mainClient/verifyotp/VerifyOTP";
import ResetPassword from "../containers/client/mainClient/resetpassword/ResetPassword";
import DetailProduct from "../containers/client/mainClient/detailproduct/DetailProduct";
import CartPage from "../containers/client/mainClient/cartpage/CartPage";
import PayPage from "../containers/client/mainClient/paypage/PayPage";
import AccountPage from "../containers/client/mainClient/account/AccountPage";
import ProfilePage from "../containers/client/mainClient/account/profile/ProfilePage";
import OrderPage from "../containers/client/mainClient/account/order/OrderPage";
import LocationPage from "../containers/client/mainClient/account/location/LocationPage";
import SuccessPay from "../containers/client/mainClient/resultPay/SuccessPay";
import FailurePay from "../containers/client/mainClient/resultPay/FailurePay";
import OrderSuccess from "../containers/client/mainClient/resultPay/OrderSuccess";
import AdminProtectedRoute from "../containers/admin/adminprotectedroute/AdminProtectedRoute";
import Blogs from "../containers/admin/main/content/blogs/Blogs";
import Settings from "../containers/admin/main/content/settings/Settings";
import Contacts from "../containers/admin/main/content/contacts/Contacts";
import Promotions from "../containers/admin/main/content/promotions/Promotions";
import NotFound from "../containers/notfound/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Client />}>
        <Route index element={<HomePage />} />
        <Route path="san-pham" element={<ProductPage />} />
        <Route
          path="san-pham/chi-tiet-san-pham/:name"
          element={<DetailProduct />}
        />
        <Route
          path="/san-pham/danh-muc/:categorySlug"
          element={<ProductPage />}
        />
        <Route
          path="/san-pham/danh-muc-con/:subcategorySlug"
          element={<ProductPage />}
        />
        <Route path="bai-viet" element={<BlogPage />} />
        <Route path="bai-viet/chi-tiet-bai-viet/:id" element={<DetailBlog />} />
        <Route path="gioi-thieu" element={<AboutPage />} />
        <Route path="cua-hang" element={<StorePage />} />
        <Route path="gio-hang" element={<CartPage />} />
        <Route path="gio-hang/thanh-toan" element={<PayPage />} />
        <Route path="dang-nhap" element={<LoginPage />} />
        <Route path="dang-ky" element={<Register />} />
        <Route path="quen-mat-khau" element={<ForgotPassword />} />
        <Route path="quen-mat-khau/nhap-ma-otp" element={<VerifyOTP />} />
        <Route
          path="quen-mat-khau/dat-lai-mat-khau"
          element={<ResetPassword />}
        />
        <Route path="dat-hang-thanh-cong" element={<OrderSuccess />} />
        <Route path="thanh-toan-thanh-cong" element={<SuccessPay />} />
        <Route path="thanh-toan-that-bai" element={<FailurePay />} />

        <Route path="tai-khoan" element={<AccountPage />}>
          <Route path="ho-so" element={<ProfilePage />} />
          <Route path="dia-chi" element={<LocationPage />} />
          <Route path="don-hang" element={<OrderPage />} />
          <Route index element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="/admin/dang-nhap" element={<LoginAdmin />} />

      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<Navigate to="trang-chu" />} />
        <Route path="trang-chu" element={<Dashboard />} />
        <Route path="don-hang" element={<Orders />} />
        <Route path="san-pham" element={<Products />} />
        <Route path="nguoi-dung" element={<Users />} />
        <Route path="nguoi-dung/them" element={<AddUser />} />
        <Route path="bai-viet" element={<Blogs />} />
        <Route path="khuyen-mai" element={<Promotions />} />
        <Route path="phan-hoi" element={<Contacts />} />
        <Route path="cai-dat" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
