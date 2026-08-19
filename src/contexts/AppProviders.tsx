import type { ReactNode } from 'react';
import { ProductsProvider } from './ProductsContext';
import { CartProvider } from './CartContex';
import { BrowserRouter } from 'react-router-dom';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <ProductsProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </ProductsProvider>
    </BrowserRouter>
  );
};
