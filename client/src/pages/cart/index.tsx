import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/hooks/use-cart";
import { useAuth } from "@/context/hooks/use-auth";

export const CartPage = () => {
    const { items, totalItems, removeItem, updateQuantity } = useCart();
    const { authenticated } = useAuth();
    const navigate = useNavigate();

    const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

    const handleCheckout = () => {
        if (!authenticated) {
            navigate("/login?redirect=/checkout");
        } else {
            navigate("/checkout");
        }
    };

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

                <h2 className="fw-bold mb-4" style={{ color: "var(--text-color)" }}>
                    Carrinho de compras
                    {totalItems > 0 && (
                        <span
                            className="ms-2 badge"
                            style={{ backgroundColor: "var(--primary-color)", color: "var(--primary-color-text)", fontSize: "0.8rem" }}
                        >
                            {totalItems}
                        </span>
                    )}
                </h2>

                {items.length === 0 ? (
                    <div
                        className="text-center py-5 rounded"
                        style={{
                            backgroundColor: "var(--surface-card)",
                            border: "1px solid var(--surface-border)",
                            color: "var(--text-color-secondary)",
                        }}
                    >
                        <i className="pi pi-shopping-cart mb-3" style={{ fontSize: "3rem" }} />
                        <p className="mt-3">Seu carrinho está vazio.</p>
                    </div>
                ) : (
                    <>
                        <div className="d-flex flex-column gap-3 mb-4">
                            {items.map(({ product, quantity }) => (
                                <div
                                    key={product.id}
                                    className="d-flex align-items-center gap-3 p-3 rounded"
                                    style={{
                                        backgroundColor: "var(--surface-card)",
                                        border: "1px solid var(--surface-border)",
                                    }}
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                                    />
                                    <div className="flex-grow-1">
                                        <p className="fw-semibold mb-1" style={{ color: "var(--text-color)" }}>
                                            {product.name}
                                        </p>
                                        <p className="mb-0" style={{ color: "var(--primary-color)", fontWeight: 600 }}>
                                            {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                        </p>
                                    </div>

                                    {/* Controle de quantidade */}
                                    <div className="d-flex align-items-center gap-2">
                                        <button
                                            className="btn btn-sm"
                                            style={{
                                                backgroundColor: "var(--surface-ground)",
                                                color: "var(--text-color)",
                                                border: "1px solid var(--surface-border)",
                                                width: "32px",
                                            }}
                                            onClick={() => updateQuantity(product.id!, quantity - 1)}
                                            disabled={quantity <= 1}
                                        >
                                            −
                                        </button>
                                        <span style={{ minWidth: "24px", textAlign: "center", color: "var(--text-color)" }}>
                                            {quantity}
                                        </span>
                                        <button
                                            className="btn btn-sm"
                                            style={{
                                                backgroundColor: "var(--surface-ground)",
                                                color: "var(--text-color)",
                                                border: "1px solid var(--surface-border)",
                                                width: "32px",
                                            }}
                                            onClick={() => updateQuantity(product.id!, quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Subtotal */}
                                    <p className="mb-0 fw-semibold" style={{ minWidth: "80px", textAlign: "right", color: "var(--text-color)" }}>
                                        {(product.price * quantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </p>

                                    {/* Remover */}
                                    <button
                                        className="btn btn-sm"
                                        style={{
                                            backgroundColor: "transparent",
                                            color: "var(--text-color-secondary)",
                                            border: "none",
                                        }}
                                        onClick={() => removeItem(product.id!)}
                                        title="Remover item"
                                    >
                                        <i className="pi pi-trash" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Rodapé do carrinho */}
                        <div
                            className="d-flex justify-content-between align-items-center p-3 rounded"
                            style={{
                                backgroundColor: "var(--surface-card)",
                                border: "1px solid var(--surface-border)",
                            }}
                        >
                            <span className="fw-semibold fs-5" style={{ color: "var(--text-color)" }}>
                                Total:{" "}
                                <span style={{ color: "var(--primary-color)" }}>
                                    {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </span>
                            </span>
                            <button
                                className="btn"
                                style={{
                                    backgroundColor: "var(--primary-color)",
                                    color: "var(--primary-color-text)",
                                    border: "none",
                                    paddingLeft: "1.5rem",
                                    paddingRight: "1.5rem",
                                }}
                                onClick={handleCheckout}
                            >
                                Finalizar compra
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
