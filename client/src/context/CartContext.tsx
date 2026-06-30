import { createContext, useState, useEffect, useRef, useContext } from "react";
import type { ReactNode } from "react";
import type { ICartItem, IProduct } from "@/commons/types";
import { AuthContext } from "@/context/AuthContext";

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
    const { authenticatedUser } = useContext(AuthContext);
    const [items, setItems] = useState<ICartItem[]>([]);
    // Ref keeps the current userId in sync for the save effect without causing
    // a race condition where the old user's items are written to the new user's key.
    const userIdRef = useRef<number | undefined>(undefined);

    // Load the correct cart whenever the authenticated user changes
    useEffect(() => {
        const userId = authenticatedUser?.id;
        userIdRef.current = userId;
        if (userId !== undefined) {
            try {
                const raw = localStorage.getItem(`cart_${userId}`);
                setItems(raw ? JSON.parse(raw) : []);
            } catch {
                setItems([]);
            }
        } else {
            setItems([]);
        }
    }, [authenticatedUser?.id]);

    // Persist cart to localStorage whenever items change
    useEffect(() => {
        const userId = userIdRef.current;
        if (userId !== undefined) {
            localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
        }
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
