type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: string;
}

export function EmptyState({ title, description, icon = "📭" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <span className="text-5xl">{icon}</span>
      <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--muted)] max-w-sm">{description}</p>
      )}
    </div>
  );
}
