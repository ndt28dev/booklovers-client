import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import bookSlice from "./slices/bookSlice";
import blogSlice from "./slices/blogSlice";
import authSlice from "./slices/authSlice";
import contactSlice from "./slices/contactSlice";
import cartSlice from "./slices/cartSlice";
import orderSlice from "./slices/orderSlice";
import categorySlice from "./slices/categorySlice";
import vnpaySlice from "./slices/vnpaySlice";
import orderSliceAdmin from "./slices/admin/orderSlice";
import promotionSlice from "./slices/promotionSlice";
import supplierSlice from "./slices/supplierSlice";
import importsSlice from "./slices/importSlice";
import subcategorySlice from "./slices/subcategorySlice";
import systemSlice from "./slices/admin/systemSlice";
import reviewSlice from "./slices/reviewSlice";
import salesSlice from "./slices/admin/SalesSlice";
import customerSlice from "./slices/admin/CustomerSlice";
import productsImportsSlice from "./slices/admin/ProductsImportsSlice";
import reviewsContactsSlice from "./slices/admin/ReviewsContactsSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    book: bookSlice,
    blog: blogSlice,
    contact: contactSlice,
    auth: authSlice,
    cart: cartSlice,
    order: orderSlice,
    category: categorySlice,
    subcategory: subcategorySlice,
    vnpay: vnpaySlice,
    adminOrder: orderSliceAdmin,
    promotion: promotionSlice,
    supplier: supplierSlice,
    imports: importsSlice,
    review: reviewSlice,
    system: systemSlice,
    adminSales: salesSlice,
    adminCustomer: customerSlice,
    adminProductsImports: productsImportsSlice,
    adminReviewsContacts: reviewsContactsSlice,
  },
});
