import { Card } from "primereact/card";
import type {IProduct} from "@/commons/types.ts";
import {Button} from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/hooks/use-cart";

interface IProductCardProps {
    product: IProduct;
}

export const ProductCard = ({ product } : IProductCardProps) => {
    const navigate = useNavigate();
    const { addItem } = useCart();

    return (
        <div style={{ height: "100%" }}>
            <Card
                title={product.name}
                subTitle={product.description}
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "16px",
                    overflow: "hidden",
                }}
                header={
                    <img
                        alt={product.name}
                        src={product.image}
                        style={{ width: "100%", height: "200px", objectFit: "cover" }}
                    />
                }
                footer={
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Button
                            label="Detalhes"
                            className="p-button-secondary p-button-sm"
                            style={{ borderRadius: "20px", flex: 1 }}
                            onClick={() => navigate(`/product/${product.id}`)}
                        />
                        <Button
                            icon="pi pi-shopping-cart"
                            className="p-button-sm"
                            style={{ borderRadius: "20px" }}
                            tooltip="Adicionar ao carrinho"
                            tooltipOptions={{ position: "top" }}
                            onClick={() => addItem(product)}
                        />
                    </div>
                }
            >
                <p>{`R$ ${product.price}`}</p>
            </Card>
        </div>
    );
}