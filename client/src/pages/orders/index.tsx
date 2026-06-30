import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import OrderService from "@/services/order-service";
import type { IOrderDTO } from "@/commons/types";

export const OrderHistoryPage = () => {
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [orders, setOrders] = useState<IOrderDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await OrderService.findAll();
            setLoading(false);
            if (response.success) {
                setOrders(response.data);
            } else {
                toast.current?.show({ severity: "error", summary: "Erro", detail: response.message, life: 4000 });
            }
        };
        fetchOrders();
    }, []);

    const toggleExpand = (id: number) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString("pt-BR");
    const formatCurrency = (value?: number) =>
        value == null ? "—" : value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    return (
        <div style={{ backgroundColor: "var(--surface-ground)", minHeight: "100vh" }}>
            <Toast ref={toast} />
            <div className="container py-4" style={{ maxWidth: "860px" }}>
                <div className="d-flex align-items-center gap-3 mb-4">
                    <Button
                        icon="pi pi-arrow-left"
                        className="p-button-text p-button-sm"
                        onClick={() => navigate("/profile")}
                        tooltip="Voltar ao perfil"
                    />
                    <h1 className="h4 fw-bold m-0" style={{ color: "var(--text-color)" }}>
                        <i className="pi pi-list me-2" />
                        Histórico de Pedidos
                    </h1>
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center py-5">
                        <ProgressSpinner />
                    </div>
                ) : orders.length === 0 ? (
                    <Card>
                        <div className="text-center py-5">
                            <i className="pi pi-inbox" style={{ fontSize: "3rem", color: "var(--text-color-secondary)" }} />
                            <p className="mt-3" style={{ color: "var(--text-color-secondary)" }}>
                                Você ainda não realizou nenhum pedido.
                            </p>
                            <Button
                                label="Ver produtos"
                                icon="pi pi-shopping-bag"
                                className="p-button-sm mt-2"
                                onClick={() => navigate("/products")}
                            />
                        </div>
                    </Card>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {[...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((order) => {
                            const isExpanded = expandedIds.has(order.id);
                            return (
                                <Card key={order.id} style={{ border: "1px solid var(--surface-border)" }}>
                                    {/* Cabeçalho do pedido */}
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex flex-column gap-1">
                                            <span className="fw-bold" style={{ color: "var(--text-color)" }}>
                                                Pedido #{order.id}
                                            </span>
                                            <span style={{ color: "var(--text-color-secondary)", fontSize: "0.85rem" }}>
                                                <i className="pi pi-calendar me-1" />
                                                {formatDate(order.date)}
                                            </span>
                                            {order.paymentMethod && (
                                                <span style={{ color: "var(--text-color-secondary)", fontSize: "0.85rem" }}>
                                                    <i className="pi pi-credit-card me-1" />
                                                    {order.paymentMethod}
                                                </span>
                                            )}
                                        </div>
                                        <div className="d-flex align-items-center gap-3">
                                            <span className="fw-bold fs-6" style={{ color: "var(--primary-color)" }}>
                                                {formatCurrency(order.total)}
                                            </span>
                                            <Button
                                                icon={isExpanded ? "pi pi-chevron-up" : "pi pi-chevron-down"}
                                                className="p-button-text p-button-sm"
                                                tooltip={isExpanded ? "Ocultar itens" : "Ver itens"}
                                                onClick={() => toggleExpand(order.id)}
                                            />
                                        </div>
                                    </div>

                                    {/* Itens expandíveis */}
                                    {isExpanded && (
                                        <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--surface-border)" }}>
                                            {!order.items || order.items.length === 0 ? (
                                                <p style={{ color: "var(--text-color-secondary)", fontSize: "0.9rem" }}>
                                                    Sem itens registrados.
                                                </p>
                                            ) : (
                                                <div className="d-flex flex-column gap-2">
                                                    <span className="fw-semibold mb-1" style={{ color: "var(--text-color-secondary)", fontSize: "0.85rem" }}>
                                                        ITENS DO PEDIDO
                                                    </span>
                                                    {order.items.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="d-flex justify-content-between align-items-center"
                                                            style={{ fontSize: "0.9rem" }}
                                                        >
                                                            <span style={{ color: "var(--text-color)" }}>
                                                                <span className="fw-semibold">{item.quantity}×</span>{" "}
                                                                {item.productName ?? `Produto #${item.productId}`}
                                                            </span>
                                                            <span style={{ color: "var(--text-color-secondary)" }}>
                                                                {formatCurrency(item.price != null ? item.price : undefined)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
