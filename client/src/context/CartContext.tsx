import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { ICartItem, IProduct } from "@/commons/types";

interface CartContextType {
    items: ICartItem[];
    totalItems: number;
    addItem: (product: IProduct) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
}

interface CartProviderProps {
    children: ReactNode;
}

export const CartContext = createContext({} as CartContextType);

export const CartProvider = ({ children }: CartProviderProps) => {
    const [items, setItems] = useState<ICartItem[]>(() => {
        try {
            const raw = localStorage.getItem("cart");
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addItem = (product: IProduct) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.product.id === product.id);
            if (existing) {
                return prev.map((i) =>
                    i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const removeItem = (productId: number) => {
        setItems((prev) => prev.filter((i) => i.product.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity < 1) return;
        setItems((prev) =>
            prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, totalItems, addItem, removeItem, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
