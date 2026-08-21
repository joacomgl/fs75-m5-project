import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider }    from "./Theme/ThemeProvider";
import { AuthProvider }     from "./auth/AuthContext";
import { ProductsProvider } from "./products/ProductProvider.tsx";
import { CartProvider }     from "./cart/CartContext";
import { OrdersProvider }   from "./orders/OrdersProvider";

/**
 * Wraps the entire app with all required React context providers.
 * Order: BrowserRouter > Theme > Auth > Products > Cart > Orders
 *
 * OrdersProvider is inside AuthProvider so it can access the current user.
 */
export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>
              <OrdersProvider>
                {children}
              </OrdersProvider>
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};
