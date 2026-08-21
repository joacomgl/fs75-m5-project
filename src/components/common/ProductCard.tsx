import { useState } from 'react';
import type { Product } from '../../types/product.types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {

        const [open, setOpen] = useState(false);

    const handleDelete = () => {
        console.log("Eliminando producto...");
        setOpen(false);
    }

    return (
        <li>
            {product.name} - ${product.price}
            
            <button onClick={() => setOpen(true)}>Eliminar producto</button>
            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Eliminar producto"
            >
                <p>Seguro que quieres eliminarlo?</p>
                <Button variant="solid" onClick={handleDelete}>
                confirmar
                </Button>
            </Modal>
        </li>
    );
}