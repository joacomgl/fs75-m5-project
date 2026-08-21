import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider }   from "./Theme/ThemeProvider";
import { AuthProvider }    from "./auth/AuthContext";
import { ProductsProvider } from "./products/ProductProvider.tsx";
import { CartProvider }    from "./cart/CartContext";

/**
 * Wraps the entire app with all required React context providers.
 * Order matters: BrowserRouter > Theme > Auth > Products > Cart
 */
export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};
