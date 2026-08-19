// src/services/products.service.ts
import {
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    where,
    orderBy
} from "firebase/firestore";
import { db } from "../config/firebase";
import type { Product } from "../types/product.types";

//* Obtener todos los productos:
export const getProducts = async (): Promise<Product[]> => {
        const snapshot = await getDocs (collection (db, "products"));
        // console.log("Products:", products);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
            } as Product));
};

//* Obtener un producto por su ID:
export const getProductById = async (
    id: string
): Promise<Product | null> => {
    const ref = doc(db, "products", id);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return null;

    return {
        id: snapshot.id,
        ...snapshot.data()
    } as Product;
};

//* Obtener productos por categoría ordenadas por precio:
export const getProductsByCategory = async (
    category: string
): Promise<Product[]> => {
    const q = query(
        collection(db, "products"),
        where("category", "==", category),
        orderBy("price", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    }) as Product);
};
