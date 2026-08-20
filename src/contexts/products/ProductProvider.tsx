import { useEffect, useState, useMemo } from 'react';
import { getProducts } from '../../services/products.service';
import type { Product } from '../../types/product.types';
import { ProductsContext } from './ProductsContext';

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {


    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts()
            .then(setProducts)
            .finally(() => setLoading(false));
    }, []);

    const value = useMemo(() => ({ products, loading }), [products, loading]);

    return (
        <ProductsContext.Provider value={value}>
            {children}
        </ProductsContext.Provider>
    );
}