import type { ReactNode } from 'react';
import { ProductsProvider } from './ProductsContext';
import { CartProvider } from './cart/CartContext';
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
