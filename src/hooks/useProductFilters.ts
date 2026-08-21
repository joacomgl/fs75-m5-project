import { useState, useMemo } from "react";
import { useProducts } from "../contexts/products/useProducts";
import { useDebounce } from "./useDebounce";
import type { CategoryId } from "../types/product.types";

export type SortOption = "name-asc" | "price-asc" | "price-desc";

/**
 * useProductFilters — encapsulates all catalog filtering logic.
 * Filters happen in memory on top of the products already loaded by ProductsContext.
 * No extra Firebase calls are made.
 */
export function useProductFilters() {
  const { products, loading } = useProducts();

  const [searchTerm,       setSearchTerm]       = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "all">("all");
  const [sortBy,           setSortBy]           = useState<SortOption>("name-asc");

  // Debounce the search term so filtering doesn't run on every keystroke
  const debouncedSearch = useDebounce(searchTerm.toLowerCase().trim(), 400);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    // 2. Filter by search (uses debounced value)
    if (debouncedSearch.length >= 1) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(debouncedSearch) ||
        p.description.toLowerCase().includes(debouncedSearch)
      );
    }

    // 3. Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [products, selectedCategory, debouncedSearch, sortBy]);

  return {
    filteredProducts,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    totalResults: filteredProducts.length,
  };
}
