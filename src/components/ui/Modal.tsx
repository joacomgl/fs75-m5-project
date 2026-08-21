import { Button } from "./Button";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div>
      <div>
        {title && <h2>{title}</h2>}
        <div>{children}</div>
        
        <Button variant="solid" onClick={onClose}>
          Cerrar
        </Button>  
      </div>
    </div>
  );
}