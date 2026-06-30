import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { useCart } from "@/context/hooks/use-cart";
import { useAuth } from "@/context/hooks/use-auth";
import OrderService from "@/services/order-service";
import AddressService from "@/services/address-service";
import type { IAddressDTO } from "@/commons/types";

const PAYMENT_METHODS = ["Pix", "Cartão de crédito", "Boleto"] as const;

export const CheckoutPage = () => {
    const { items, clearCart } = useCart();
    const { authenticatedUser } = useAuth();
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(false);

    const [addresses, setAddresses] = useState<IAddressDTO[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [addressError, setAddressError] = useState(false);
    const [paymentError, setPaymentError] = useState(false);

    const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

    useEffect(() => {
        AddressService.findAll().then((res) => {
            if (res.success && Array.isArray(res.data)) {
                setAddresses(res.data);
            }
        });
    }, []);

    const handleFinalize = async () => {
        if (items.length === 0) return;

        const hasAddress = selectedAddressId !== null;
        const hasPayment = paymentMethod !== "";
        setAddressError(!hasAddress);
        setPaymentError(!hasPayment);
        if (!hasAddress || !hasPayment) return;

        setLoading(true);
        const payload = {
            addressId: selectedAddressId!,
            paymentMethod,
            items: items.map((i) => ({ productId: i.product.id!, quantity: i.quantity })),
        };
        const response = await OrderService.create(payload);
        setLoading(false);
        if (response.success) {
            toast.current?.show({
                severity: "success",
                summary: "Pedido confirmado!",
                detail: response.message,
                life: 3000,
            });
            clearCart();
            setTimeout(() => navigate("/"), 2000);
        } else {
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: response.message,
                life: 4000,
            });
        }
    };

    if (items.length === 0) {
        return (
            <div className="container pt-5 text-center" style={{ color: "var(--text-color)" }}>
                <i className="pi pi-check-circle mb-3" style={{ fontSize: "3rem", color: "var(--primary-color)" }} />
                <h4 className="mt-2">Nenhum item no carrinho.</h4>
                <Button label="Voltar à loja" icon="pi pi-arrow-left" className="p-button-outlined mt-3" onClick={() => navigate("/")} />
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "var(--surface-ground)", minHeight: "100vh", color: "var(--text-color)" }}>
            <Toast ref={toast} />
            <div className="container pb-5" style={{ paddingTop: "3.5rem", maxWidth: "720px" }}>
                <button
                    className="btn btn-sm mb-4"
                    style={{
                        backgroundColor: "var(--surface-card)",
                        color: "var(--text-color)",
                        border: "1px solid var(--surface-border)",
                    }}
                    onClick={() => navigate("/cart")}
                >
                    &larr; Voltar ao carrinho
                </button>

                <h2 className="fw-bold mb-4">Resumo do pedido</h2>

                {/* Dados do cliente */}
                <div
                    className="p-3 rounded mb-3"
                    style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--surface-border)" }}
                >
                    <h6 className="fw-semibold mb-2" style={{ color: "var(--text-color-secondary)" }}>
                        <i className="pi pi-user me-2" />
                        Cliente
                    </h6>
                    <p className="mb-0 fw-semibold">{authenticatedUser?.displayName}</p>
                    <p className="mb-0" style={{ color: "var(--text-color-secondary)", fontSize: "0.9rem" }}>
                        {authenticatedUser?.username}
                    </p>
                </div>

                {/* Itens */}
                <div
                    className="p-3 rounded mb-3"
                    style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--surface-border)" }}
                >
                    <h6 className="fw-semibold mb-3" style={{ color: "var(--text-color-secondary)" }}>
                        <i className="pi pi-shopping-bag me-2" />
                        Itens ({items.reduce((s, i) => s + i.quantity, 0)})
                    </h6>
                    <div className="d-flex flex-column gap-3">
                        {items.map(({ product, quantity }) => (
                            <div key={product.id} className="d-flex align-items-center gap-3">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "6px" }}
                                />
                                <div className="flex-grow-1">
                                    <p className="mb-0 fw-semibold" style={{ color: "var(--text-color)" }}>{product.name}</p>
                                    <p className="mb-0" style={{ color: "var(--text-color-secondary)", fontSize: "0.85rem" }}>
                                        {quantity}× {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </p>
                                </div>
                                <span className="fw-semibold" style={{ color: "var(--primary-color)" }}>
                                    {(product.price * quantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Endereço de entrega */}
                <div
                    className="p-3 rounded mb-3"
                    style={{
                        backgroundColor: "var(--surface-card)",
                        border: `1px solid ${addressError ? "var(--red-500)" : "var(--surface-border)"}`,
                    }}
                >
                    <h6 className="fw-semibold mb-3" style={{ color: "var(--text-color-secondary)" }}>
                        <i className="pi pi-map-marker me-2" />
                        Endereço de entrega <span style={{ color: "var(--red-500)" }}>*</span>
                    </h6>
                    {addresses.length === 0 ? (
                        <div className="d-flex align-items-center gap-2" style={{ color: "var(--text-color-secondary)", fontSize: "0.9rem" }}>
                            <span>Nenhum endereço cadastrado.</span>
                            <Button
                                label="Cadastrar endereço"
                                icon="pi pi-plus"
                                className="p-button-link p-button-sm p-0"
                                onClick={() => navigate("/profile/addresses")}
                            />
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-2">
                            {addresses.map((addr) => (
                                <label
                                    key={addr.id}
                                    className="d-flex align-items-start gap-2"
                                    style={{ cursor: "pointer" }}
                                >
                                    <input
                                        type="radio"
                                        name="address"
                                        value={addr.id}
                                        checked={selectedAddressId === addr.id}
                                        onChange={() => { setSelectedAddressId(addr.id!); setAddressError(false); }}
                                        style={{ marginTop: "3px", accentColor: "var(--primary-color)" }}
                                    />
                                    <div>
                                        <span className="fw-semibold" style={{ color: "var(--text-color)" }}>{addr.address}</span>
                                        {addr.complement && (
                                            <span style={{ color: "var(--text-color-secondary)", fontSize: "0.85rem" }}> — {addr.complement}</span>
                                        )}
                                        <div style={{ color: "var(--text-color-secondary)", fontSize: "0.85rem" }}>CEP: {addr.cep}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                    {addressError && <small style={{ color: "var(--red-500)" }}>Selecione um endereço de entrega.</small>}
                </div>

                {/* Forma de pagamento */}
                <div
                    className="p-3 rounded mb-3"
                    style={{
                        backgroundColor: "var(--surface-card)",
                        border: `1px solid ${paymentError ? "var(--red-500)" : "var(--surface-border)"}`,
                    }}
                >
                    <h6 className="fw-semibold mb-3" style={{ color: "var(--text-color-secondary)" }}>
                        <i className="pi pi-credit-card me-2" />
                        Forma de pagamento <span style={{ color: "var(--red-500)" }}>*</span>
                    </h6>
                    <div className="d-flex flex-column gap-2">
                        {PAYMENT_METHODS.map((method) => (
                            <label key={method} className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={method}
                                    checked={paymentMethod === method}
                                    onChange={() => { setPaymentMethod(method); setPaymentError(false); }}
                                    style={{ accentColor: "var(--primary-color)" }}
                                />
                                <span style={{ color: "var(--text-color)" }}>{method}</span>
                            </label>
                        ))}
                    </div>
                    {paymentError && <small style={{ color: "var(--red-500)" }}>Selecione uma forma de pagamento.</small>}
                </div>

                {/* Total + botão */}
                <div
                    className="d-flex justify-content-between align-items-center p-3 rounded"
                    style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--surface-border)" }}
                >
                    <span className="fw-bold fs-5">
                        Total:{" "}
                        <span style={{ color: "var(--primary-color)" }}>
                            {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                    </span>
                    <Button
                        label="Finalizar compra"
                        icon="pi pi-check"
                        loading={loading}
                        onClick={handleFinalize}
                        style={{ backgroundColor: "var(--primary-color)", border: "none", paddingInline: "1.5rem" }}
                    />
                </div>
            </div>
        </div>
    );
};
