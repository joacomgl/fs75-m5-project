import { createContext } from 'react';
import type { ProductsContextType } from './ProductsContext.types';

//*Context:
const ProductsContext = createContext<ProductsContextType | undefined>(
    undefined,
);
