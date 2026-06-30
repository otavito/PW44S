import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "@/App.tsx";

import { PrimeReactProvider } from "primereact/api";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css"; //flex utilities
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import lightThemeUrl from "primereact/resources/themes/lara-light-green/theme.css?url";
import darkThemeUrl from "primereact/resources/themes/lara-dark-green/theme.css?url";

const isDark = localStorage.getItem("theme") === "dark";
let themeLink = document.getElementById("theme-link") as HTMLLinkElement | null;
if (!themeLink) {
    themeLink = document.createElement("link");
    themeLink.id = "theme-link";
    themeLink.rel = "stylesheet";
    document.head.appendChild(themeLink);
}
themeLink.href = isDark ? darkThemeUrl : lightThemeUrl;

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <PrimeReactProvider>
                <AuthProvider>
                    <CartProvider>
                        <App />
                    </CartProvider>
                </AuthProvider>
            </PrimeReactProvider>
        </BrowserRouter>
    </StrictMode>
);