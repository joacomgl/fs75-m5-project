import { useState, type FormEvent, type ChangeEvent } from "react";
import { uploadImageToS3 } from "../../../services/upload.service";
import { createProduct, updateProduct, type CreateProductPayload } from "../../../services/products.service";
import type { CategoryId, Product } from "../../../types/product.types";

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "mouse", label: "Mouse" },
  { id: "keyboard", label: "Teclado" },
  { id: "headset", label: "Auriculares" },
  { id: "monitor", label: "Monitor" },
  { id: "chair", label: "Silla" },
];

interface AdminProductFormProps {
  productToEdit?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AdminProductForm({ productToEdit, onSuccess, onCancel }: AdminProductFormProps) {
  const isEditing = Boolean(productToEdit);

  const [name, setName] = useState(productToEdit?.name || "");
  const [description, setDescription] = useState(productToEdit?.description || "");
  const [price, setPrice] = useState<number | string>(productToEdit?.price ?? "");
  const [stock, setStock] = useState<number | string>(productToEdit?.stock ?? "");
  const [categoryId, setCategoryId] = useState<CategoryId>(productToEdit?.categoryId || "mouse");
  const [imageUrl, setImageUrl] = useState(productToEdit?.image || "");

  // Upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // create preview url
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const numPrice = Number(price);
    const numStock = Number(stock);

    if (!name.trim()) {
      setError("El nombre del producto es obligatorio.");
      return;
    }
    if (isNaN(numPrice) || numPrice <= 0) {
      setError("El precio debe ser un número positivo.");
      return;
    }
    if (isNaN(numStock) || numStock < 0) {
      setError("El stock no puede ser negativo.");
      return;
    }

    setSaving(true);

    try {
      let finalImageUrl = imageUrl;

      // If a new local file was selected, upload it to S3 first
      if (selectedFile) {
        setUploading(true);
        try {
          finalImageUrl = await uploadImageToS3(selectedFile);
        } catch (uploadErr: any) {
          console.error("Error uploading to S3:", uploadErr);
          throw new Error(
            `Fallo al subir la imagen a S3: ${uploadErr.message || "Verifica credenciales de AWS en Vercel"}`
          );
        } finally {
          setUploading(false);
        }
      }

      if (!finalImageUrl) {
        throw new Error("Debes proporcionar una imagen o subir un archivo.");
      }

      const payload: CreateProductPayload = {
        name: name.trim(),
        nameLower: name.trim().toLowerCase(),
        description: description.trim(),
        price: numPrice,
        stock: numStock,
        categoryId,
        image: finalImageUrl,
      };

      if (isEditing && productToEdit) {
        await updateProduct(productToEdit.id, payload);
      } else {
        await createProduct(payload);
      }

      onSuccess();
    } catch (err: any) {
      console.error("Error saving product:", err);
      setError(err.message || "Error al guardar el producto.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            {isEditing ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            {isEditing ? "Actualiza los datos del producto seleccionado" : "Crea un producto con subida segura a AWS S3"}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] px-2 py-1"
        >
          ✕ Cancelar
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">Nombre del producto *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Mouse Logitech G502 HERO"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">Categoría *</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value as CategoryId)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">Precio (ARS) *</label>
          <input
            type="number"
            required
            min="1"
            step="any"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ej: 45000"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">Stock Disponible *</label>
          <input
            type="number"
            required
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Ej: 15"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
          />
        </div>

        {/* Image upload / URL */}
        <div>
          <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
            Imagen del Producto (Upload a S3) *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-xs text-[var(--muted)] file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[var(--primary)] file:text-[var(--primary-foreground)] hover:file:bg-[var(--primary-hover)] file:cursor-pointer cursor-pointer"
          />
          {selectedFile && (
            <p className="text-[11px] text-[var(--primary)] mt-1 font-medium">
              📁 Seleccionado: {selectedFile.name} (se subirá a AWS S3)
            </p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">Descripción</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción y especificaciones técnicas del producto..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none resize-none"
          />
        </div>

        {/* Image Preview */}
        {imageUrl && (
          <div className="md:col-span-2 flex items-center gap-4 p-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
            <img
              src={imageUrl}
              alt="Vista previa"
              className="w-20 h-20 object-cover rounded-lg border border-[var(--border)] shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/80x80/1e293b/94a3b8?text=Error";
              }}
            />
            <div className="text-xs space-y-1 overflow-hidden">
              <span className="font-semibold text-[var(--foreground)]">Vista previa de la imagen</span>
              <p className="text-[var(--muted)] truncate font-mono text-[10px]">{imageUrl}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving || uploading}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[var(--border)] hover:bg-[var(--surface)] transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving || uploading}
          className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {uploading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Subiendo a S3...
            </>
          ) : saving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Guardando en Firestore...
            </>
          ) : isEditing ? (
            "Actualizar Producto"
          ) : (
            "Crear Producto"
          )}
        </button>
      </div>
    </form>
  );
}
