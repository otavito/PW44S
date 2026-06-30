import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { IProduct } from "@/commons/types.ts";
import ProductService from "@/services/product-service.ts";
import { ProductCarousel } from "@/components/product-carousel";
import { useCart } from "@/context/hooks/use-cart";
import { ProductCard } from "@/components/product-card";

export const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [similarProducts, setSimilarProducts] = useState<IProduct[]>([]);

    useEffect(() => {
        if (!id) return;
        loadProduct(Number(id));
    }, [id]);

    const loadProduct = async (productId: number) => {
        setLoading(true);
        setError(null);
        setSimilarProducts([]);
        const response = await ProductService.findById(productId);
        if (response?.status === 200) {
            const loaded: IProduct = response.data;
            setProduct(loaded);
            if (loaded.category?.id) {
                loadSimilar(loaded.category.id, productId);
            }
        } else {
            setError("Produto não encontrado.");
        }
        setLoading(false);
    };

    const loadSimilar = async (categoryId: number, currentId: number) => {
        const response = await ProductService.findProductsByCategory(String(categoryId));
        if (response?.status === 200) {
            const all: IProduct[] = Array.isArray(response.data) ? response.data : response.data.content ?? [];
            setSimilarProducts(all.filter((p) => p.id !== currentId).slice(0, 3));
        }
    };

    if (loading) {
        return (
            <div className="container pt-5 mt-5 text-center">
                <div className="spinner-border" role="status" style={{ color: "var(--primary-color)" }}>
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container pt-5 mt-5">
                <div className="alert alert-danger">{error ?? "Produto não encontrado."}</div>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    Voltar
                </button>
            </div>
        );
    }

    const images = [product.image, product.mini1, product.mini2, product.mini3].filter(Boolean) as string[];

    return (
        <div
            style={{
                backgroundColor: "var(--surface-ground)",
                color: "var(--text-color)",
                minHeight: "100vh",
            }}
        >
            <div className="container pb-4" style={{ paddingTop: "3.5rem" }}>
                <button
                    className="btn btn-sm mb-4"
                    style={{
                        backgroundColor: "var(--surface-card)",
                        color: "var(--text-color)",
                        border: "1px solid var(--surface-border)",
                    }}
                    onClick={() => navigate(-1)}
                >
                    &larr; Voltar
                </button>

                <div className="row g-4 align-items-center">
                    {/* Carrossel de imagens */}
                    <div className="col-md-6">
                        {images.length > 0 ? (
                            <ProductCarousel images={images} productName={product.name} />
                        ) : (
                            <div
                                className="d-flex align-items-center justify-content-center rounded"
                                style={{
                                    height: "350px",
                                    backgroundColor: "var(--surface-card)",
                                    border: "1px solid var(--surface-border)",
                                    color: "var(--text-color-secondary)",
                                }}
                            >
                                Sem imagens disponíveis
                            </div>
                        )}
                    </div>

                    {/* Detalhes do produto */}
                    <div className="col-md-6 d-flex flex-column justify-content-center">
                        <h1 className="h2 fw-bold mb-3" style={{ color: "var(--text-color)" }}>
                            {product.name}
                        </h1>
                        <p className="mb-4" style={{ color: "var(--text-color-secondary)", lineHeight: "1.8" }}>
                            {product.description}
                        </p>
                        <div className="mb-4">
                            <span className="fs-3 fw-bold" style={{ color: "var(--primary-color)" }}>
                                {product.price.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </span>
                        </div>
                        {product.category && (
                            <p style={{ color: "var(--text-color-secondary)" }}>
                                <strong style={{ color: "var(--text-color)" }}>Categoria:</strong>{" "}
                                {product.category.name}
                            </p>
                        )}
                        <button
                            className="btn btn-sm mt-5"
                            style={{
                                backgroundColor: "var(--primary-color)",
                                color: "var(--primary-color-text)",
                                border: "none",
                                paddingLeft: "1.5rem",
                                paddingRight: "1.5rem",
                            }}
                            onClick={() => { addItem(product); navigate("/cart"); }}
                        >
                            <i className="pi pi-shopping-cart me-2" />
                            Adicionar ao carrinho
                        </button>
                    </div>
                </div>
            </div>

            {similarProducts.length > 0 && (
                <div className="container pb-5" style={{ paddingTop: "2.5rem" }}>
                    <hr style={{ borderColor: "var(--surface-border)" }} />
                    <h2 className="h5 fw-bold mb-4" style={{ color: "var(--text-color)" }}>
                        Semelhantes
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
                        {similarProducts.map((similar) => (
                            <div key={similar.id}>
                                <ProductCard product={similar} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
