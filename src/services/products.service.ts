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
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  type DocumentSnapshot,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import type { CategoryId, Product } from "../types/product.types";

// ─── Mapper ──────────────────────────────────────────────────────────────────

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
    categoryId: data.categoryId as CategoryId,  // fixed typo from "categoriId"
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  };
}

const productsCollection = collection(db, "products");

// ─── Read ─────────────────────────────────────────────────────────────────────

/** Fetch all products (used for seeding / admin full-list) */
export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map(mapProduct);
};

/** Fetch a single product by Firestore document ID */
export const getProductById = async (
  productId: string
): Promise<Product | null> => {
  const documentRef = doc(db, "products", productId);
  const snapshot = await getDoc(documentRef);
  if (!snapshot.exists()) return null;
  return mapProduct(snapshot as QueryDocumentSnapshot);
};

/** Fetch products filtered by category, ordered by price ascending */
export const getProductsByCategory = async (
  categoryId: CategoryId
): Promise<Product[]> => {
  const q = query(
    productsCollection,
    where("categoryId", "==", categoryId),
    orderBy("price", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapProduct);
};

// ─── Paginated listing with optional search & category ───────────────────────

export type ListProductsParams = {
  categoryId?: string | null;
  searchPrefix?: string;
  pageSize?: number;
  cursor?: DocumentSnapshot | null;
};

export type ListProductsResult = {
  items: Product[];
  lastDoc: DocumentSnapshot | null;
};

export async function listProducts(
  params: ListProductsParams = {}
): Promise<ListProductsResult> {
  const { categoryId, searchPrefix, pageSize = 20, cursor } = params;
  const constraints: QueryConstraint[] = [];

  if (categoryId) {
    constraints.push(where("categoryId", "==", categoryId));
  }

  constraints.push(orderBy("nameLower"));

  if (searchPrefix && searchPrefix.length >= 2) {
    constraints.push(startAt(searchPrefix));
    constraints.push(endAt(searchPrefix + "\uf8ff"));
  }

  if (cursor) {
    constraints.push(startAfter(cursor));
  }

  constraints.push(limit(pageSize));

  const q = query(productsCollection, ...constraints);
  const snapshot = await getDocs(q);
  const items = snapshot.docs.map(mapProduct);
  const lastDoc = snapshot.docs[snapshot.docs.length - 1] ?? null;

  return { items, lastDoc };
}

// ─── Write (Admin only) ───────────────────────────────────────────────────────

export type CreateProductPayload = Omit<Product, "id" | "createdAt" | "updatedAt">;

export const createProduct = async (
  payload: CreateProductPayload
): Promise<string> => {
  const docRef = await addDoc(productsCollection, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateProduct = async (
  productId: string,
  payload: Partial<CreateProductPayload>
): Promise<void> => {
  const documentRef = doc(db, "products", productId);
  await updateDoc(documentRef, {
    ...payload,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProduct = async (productId: string): Promise<void> => {
  const documentRef = doc(db, "products", productId);
  await deleteDoc(documentRef);
};
