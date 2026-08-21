type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Ocurrió un error. Intentalo de nuevo.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <span className="text-5xl">⚠️</span>
      <h3 className="text-lg font-semibold text-[var(--foreground)]">Algo salió mal</h3>
      <p className="text-sm text-[var(--muted)] max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-sm bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded-lg hover:bg-[var(--primary-hover)] transition-colors font-semibold"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
