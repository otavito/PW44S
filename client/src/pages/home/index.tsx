import { useEffect, useState } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import CarouselComponent from "@/components/carousel";
import ProductService from "@/services/product-service";
import type { IProduct, ICategory } from "@/commons/types";
import { ProductCard } from "@/components/product-card";

const HomePage = () => {
    const [productsByCategory, setProductsByCategory] = useState<{ category: ICategory; products: IProduct[] }[]>([]);
    const [loading, setLoading] = useState(true);
    const { hash } = useLocation();
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get("categoryId");
    const navigate = useNavigate();

    const visibleCategories = categoryId
        ? productsByCategory.filter(({ category }) => category.id?.toString() === categoryId)
        : productsByCategory;

    useEffect(() => {
        if (!hash || loading) return;
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [hash, loading]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await ProductService.findAll();
                if (response.status === 200) {
                    const all: IProduct[] = response.data;

                    // Agrupa produtos por categoria mantendo a ordem de aparição
                    const map = new Map<number, { category: ICategory; products: IProduct[] }>();
                    for (const product of all) {
                        if (!product.category?.id) continue;
                        const catId = product.category.id;
                        if (!map.has(catId)) {
                            map.set(catId, { category: product.category, products: [] });
                        }
                        map.get(catId)!.products.push(product);
                    }
                    setProductsByCategory(Array.from(map.values()));
                }
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <div style={{ backgroundColor: "var(--surface-ground)", color: "var(--text-color)" }}>
            {/* Hero: Carousel + Texto */}
            <section style={{ display: "flex", flexDirection: "row", width: "100%", padding: "1.5rem 1.5rem 1.5rem 1.5rem" }}>
                <div style={{ flex: "0 0 58%", maxWidth: "58%", overflow: "hidden", borderRadius: "16px" }}>
                    <CarouselComponent />
                </div>
                <div style={{ flex: "0 0 42%", maxWidth: "42%", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 3rem" }}>
                    <div>
                        <h1 className="fw-bold mb-3" style={{ fontSize: "2.2rem" }}>
                            A felicidade é doce
                        </h1>
                        <p style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "var(--text-color-secondary)" }}>
                            A Le Plat Du Jour é uma confeitaria especializada em pâtissière francesa.
                            Ofertamos leituras e releituras de receitas tradicionais francesas, unindo
                            a técnica, conceito e a sua satisfação.
                        </p>
                    </div>
                </div>
            </section>

            {/* Listagem de produtos por categoria */}
            <section className="container mt-5 pb-4">
                <div className="d-flex align-items-center justify-content-between mb-5">
                    <h2 className="fw-boldc mb-0">Clássicos franceses</h2>
                    {categoryId && (
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigate("/"); }}
                            style={{ fontSize: "0.9rem", color: "var(--primary-color)" }}
                        >
                            <i className="pi pi-times-circle me-1" />
                            Limpar seleção
                        </a>
                    )}
                </div>

                {loading && (
                    <div className="text-left py-5">
                        <div className="spinner-border text-secondary" role="status">
                            <span className="visually-hidden">Carregando...</span>
                        </div>
                    </div>
                )}

                {!loading && visibleCategories.map(({ category, products }) => (
                    <div key={category.id} id={`categoria-${category.name.toLowerCase()}`} className="mb-5 text-left">
                        <h3 className="fw-semibold mb-4 pb-2 border-bottom">{category.name}</h3>
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                            {products.map(product => (
                                <div className="col" key={product.id}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default HomePage;