import {
    collection,
    getDocs,
    doc,
    endAt,
    getDoc,
    limit,
    startAfter,
    startAt,
    query,
    where,
    orderBy,
    type DocumentSnapshot,
    type QueryConstraint,
    type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import type { CategoryId, Product } from "../types/product.types";

function mapProduct(document: QueryDocumentSnapshot): Product {
    const data = document.data();
    return {
        id: document.id,
        name: data.name,
        nameLower: data.nameLower,
        image: data.image,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoriId as CategoryId,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
    };  
}

const productsCollection = collection(db, "products");

export const getProducts = async (): Promise<Product[]> => {
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(mapProduct);
}

//* Obtener un producto por su ID:
export const getProductById = async (
    productId: string
): Promise<Product | null> => {
    const documentRef = doc(db, "products", productId);
    const snapshot = await getDoc(documentRef);
    if (!snapshot.exists()) {
    return null;
    }
    return mapProduct(snapshot as QueryDocumentSnapshot);
};

//* Obtener productos por categoría ordenadas por precio:
export const getProductsByCategory = async (
    categoryId: CategoryId,
): Promise<Product[]> => {
    const q = query(
        productsCollection,
        where("categoryId", "==", categoryId),
        orderBy("price", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapProduct)
};

export type ListProductsParams = {
    categotyId?: string | null;
    searchPrefix?: string;
    pageSize?: number;
    cursor?: DocumentSnapshot | null;
};

export type ListProductsResult = {
        items: Product [];
        lastDoc: DocumentSnapshot | null;
}

export async function listProducts(
    params: ListProductsParams = {},
): Promise<ListProductsResult> {
    const { categoryId, searchPrefix, pageSize = 20, cursor } = params;

    const constraints: QueryConstraint[] = [];

    if (categoryId) {
        constraints.push(where("categoryId", "==", categoryId));
    }

    constraints.push(orderBy("nameLower"));

    if (searchPrefix && searchPrefix.length >= 2){
        constraints.push(startAt(searchPrefix));
        constraints.push(endAt(searchPrefix + "\uf8ff"));
    }
}</ListProductsResult>