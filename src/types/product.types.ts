export type CategoryId = "mouse" | "keyboard" | "headset" | "monitor" | "chair";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: CategoryId;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}