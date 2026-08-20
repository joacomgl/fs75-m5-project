import type { ReactNode } from 'react';
import { ProductsProvider } from './products/ProductProvider.tsx';
import { CartProvider } from './cart/CartContext';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './Theme/ThemeProvider';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ProductsProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ProductsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};
