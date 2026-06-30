import { Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import HomePage from "@/pages/home";
import {Layout} from "@/components/layout";
import { NotFound } from "@/pages/not-found";
import { ProductDetail } from "@/pages/product-detail";
import { CartPage } from "@/pages/cart";
import { RequireAuth } from "@/components/require-auth";
import { ProfilePage } from "@/pages/profile";
import { AddressPage } from "@/pages/address";
import { CheckoutPage } from "@/pages/checkout";
import { OrderHistoryPage } from "@/pages/orders";

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* public routes */}
                <Route index element={<HomePage/>}/>
                <Route path="login" element={<LoginPage/>}/>
                <Route path="register" element={<RegisterPage/>}/>
                <Route path="home" element={<HomePage/>}/>
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="cart" element={<CartPage />} />

                {/* protected routes */}
                <Route element={<RequireAuth />}>
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="profile/addresses" element={<AddressPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="orders" element={<OrderHistoryPage />} />
                </Route>
            </Route>

            {/* catch all */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
