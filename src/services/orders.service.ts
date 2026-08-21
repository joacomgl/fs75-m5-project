import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import type { Order, OrderStatus, CreateOrderPayload } from "../types/order.types";
import type { CartItem } from "../types/cartItem.types";

const ordersCollection = collection(db, "orders");

// ─── Mapper ──────────────────────────────────────────────────────────────────

function mapOrder(document: QueryDocumentSnapshot): Order {
  const data = document.data();
  return {
    id:        document.id,
    userId:    data.userId,
    items:     (data.items || []) as CartItem[],
    total:     data.total || 0,
    status:    (data.status || "pending") as OrderStatus,
    createdAt: data.createdAt?.toDate() ?? new Date(),
    updatedAt: data.updatedAt?.toDate() ?? new Date(),
  };
}

// ─── Create ───────────────────────────────────────────────────────────────────

/** Creates a new order in Firestore. Returns the generated order ID. */
export const createOrder = async (
  payload: CreateOrderPayload
): Promise<string> => {
  const docRef = await addDoc(ordersCollection, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

// ─── Read ─────────────────────────────────────────────────────────────────────

/** Fetch all orders for a given user, newest first. */
export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  const q = query(
    ordersCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapOrder);
};

/** Fetch ALL orders in the system (Admin only), newest first. */
export const getAllOrders = async (): Promise<Order[]> => {
  const q = query(
    ordersCollection,
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapOrder);
};

/** Fetch a single order by ID. */
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  const snap = await getDoc(doc(db, "orders", orderId));
  if (!snap.exists()) return null;
  return mapOrder(snap as QueryDocumentSnapshot);
};

// ─── Update (Admin) ───────────────────────────────────────────────────────────

/** Update an order's status. Used by the admin panel in Phase 4. */
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<void> => {
  await updateDoc(doc(db, "orders", orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
};
