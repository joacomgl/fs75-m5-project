import { createContext, useState, useContext, useMemo } from 'react';
import type { CartItem } from '../types/cartItem.types';
import type { Product } from '../types/product.types';

//*Types:
interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
}

//*Context:
export const CartContext = createContext<CartContextType | undefined>(
    undefined,
);

//*Provider:
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    //*Estados:
    const [items, setItems] = useState<CartItem[]>([]);
    
    //*Acciones(Logica que modifica el estado):
    const addToCart = (product: Product) => {
        setItems((prev) => {
            const existingItem = prev.find((item) => item.product.id === product.id);
            if (existingItem) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
                return [...prev, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setItems((prev) => prev.filter((item) => item.product.id !== id));
    };

    const clearCart = () => {
        setItems([]);
    };

    const value = useMemo (() => {
        return {
            items,
            addToCart,
            removeFromCart,
            clearCart
        };
    }, [items]);

    return (
        <CartContext.Provider
            value={value}
        >
            {children}
        </CartContext.Provider>
    );
};

//* Custom hook to use the CartContext:
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe usarse dentro de CartProvider");
    }
    return context;
};