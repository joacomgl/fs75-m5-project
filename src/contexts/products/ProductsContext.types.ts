import type { Product } from '../../types/product.types';

//*Types:
export interface ProductsContextType {
    products: Product[];
    loading: boolean;
}
