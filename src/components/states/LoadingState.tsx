interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Cargando..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <div className="w-10 h-10 rounded-full border-4 border-[var(--border)] border-t-[var(--primary)] animate-spin" />
      <p className="text-sm text-[var(--muted)]">{message}</p>
    </div>
  );
}
