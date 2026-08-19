import { createContext, useState, useContext } from 'react';
import type { Product } from '../types/product.types';


//*Provider:
export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {

    // Placeholder image
    const DEFAULT_PRODUCT_IMAGE = 'https://picsum.photos/200';

    const [products] = useState<Product[]>([
        {
            id: '1',
            name: 'Product 1',
            price: 19.99,
            image: DEFAULT_PRODUCT_IMAGE
        },
        {
            id: '2',
            name: 'Product 2',
            price: 29.99,
            image: DEFAULT_PRODUCT_IMAGE
        }
    ] as Product[]);

    return (
        <ProductsContext.Provider value={{ products }}>
            {children}
        </ProductsContext.Provider>
    );
};

// Custom hook to use the ProductsContext:
export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error("useProducts debe usarse dentro de ProductsProvider");
    }
    return context;
};