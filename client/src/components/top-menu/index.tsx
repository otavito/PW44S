import React, { useEffect, useState } from "react";
import { Menubar } from "primereact/menubar";
import type { MenuItem } from "primereact/menuitem";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";
import { useCart } from "@/context/hooks/use-cart";
import CategoryService from "@/services/category-service";
import type { ICategory } from "@/commons/types";
import { InputSwitch } from "primereact/inputswitch";
import lightThemeUrl from "primereact/resources/themes/lara-light-blue/theme.css?url";
import darkThemeUrl from "primereact/resources/themes/lara-dark-blue/theme.css?url";

const TopMenu: React.FC = () => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        return localStorage.getItem("theme") === "dark";
    });
    const { authenticated, authenticatedUser, handleLogout } = useAuth();
    const { totalItems } = useCart();
    const [categories, setCategories] = useState<ICategory[]>([]);

    useEffect(() => {
        const themeLink = document.getElementById("theme-link") as HTMLLinkElement;
        themeLink.href = darkMode ? darkThemeUrl : lightThemeUrl;
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    useEffect(() => {
        CategoryService.findAll().then((res) => {
            if (res.success && Array.isArray(res.data)) {
                setCategories(res.data);
            }
        });
    }, []);

    const handleLogoutClick = () => {
        handleLogout();
        navigate("/login");
    };

    const items: MenuItem[] = [
        {
            label: "Categorias",
            icon: "pi pi-shop",
            items: categories.map((cat) => ({
                label: cat.name,
                command: () => navigate(`/?categoryId=${cat.id}`),
            }))
        }
    ];

    const start = (
        <div
            className="flex align-items-center gap- cursor-pointer"
            onClick={() => navigate("/")}
        >
            <img
                src={darkMode ? "/img/logo-dark.svg" : "/img/logo-light.svg"}
                alt="Logo"
                height={45}
                style={{ objectFit: "contain" }}
            />
        </div>
    );

    const end = (
        <div className="flex align-items-center gap-3">
            <div style={{ position: "relative", display: "inline-flex" }}>
                <Button
                    icon="pi pi-shopping-cart"
                    className="p-button-text"
                    onClick={() => navigate("/cart")}
                />
                {totalItems > 0 && (
                    <span
                        style={{
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            backgroundColor: "var(--primary-color)",
                            color: "var(--primary-color-text)",
                            borderRadius: "50%",
                            width: "18px",
                            height: "18px",
                            fontSize: "0.65rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            pointerEvents: "none",
                        }}
                    >
                        {totalItems}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-2">
                <i
                    className={`pi pi-sun ${
                        darkMode ? "text-gray-400" : "text-yellow-500"
                    }`}
                    style={{ marginTop: "5px" }}
                />
                <InputSwitch
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.value ?? false)}
                />
                <i
                    className={`pi pi-moon ${
                        darkMode ? "text-blue-300" : "text-gray-400"
                    }`}
                    style={{ marginTop: "5px" }}
                />
            </div>

            {authenticated && (
                <>
                    <Button
                        icon="pi pi-user"
                        className="p-button-text"
                        tooltip={authenticatedUser?.displayName}
                        tooltipOptions={{ position: "bottom" }}
                        onClick={() => navigate("/profile")}
                    />
                    <Button
                        icon="pi pi-sign-out"
                        className="p-button-text"
                        onClick={handleLogoutClick}
                    />
                </>
            )}
            {!authenticated && (
                <Button
                    label="Entrar"
                    icon="pi pi-sign-in"
                    className="p-button-sm p-button-outlined"
                    onClick={() => navigate("/login")}
                />
            )}
        </div>
    );

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                width: "100%",
                zIndex: 1000,
                backgroundColor: "var(--surface-ground)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            className="fixed top-0 left-0 w-full z-50"
        >
            <Menubar model={items} start={start} end={end} style={{ alignItems: "center" }} />
        </div>
    );
};

export default TopMenu;