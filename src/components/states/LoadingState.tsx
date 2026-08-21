import { Spinner } from "../ui/Spinner";

interface LoadingStateProps {
  message ?: string;
}

export function LoadingState (
  {message = "Cargando..." }: LoadingStateProps
) {
  return (
  <div className="flex flex-col items-center justify-center gap-3">
    <Spinner />
    <p className="state">{message}</p>
    </div>
  );
} 