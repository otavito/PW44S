import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopMenu from "@/components/top-menu";

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

export function Layout() {
    return (
        <>
            <ScrollToTop />
            <TopMenu/>
        <main style={{paddingTop: "110px", backgroundColor: "var(--surface-ground)", minHeight: "100vh"}}>
    <Outlet/>
    </main>
    </>
);
}