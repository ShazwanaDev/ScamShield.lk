export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-12 text-center">
      {icon && (
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
          {icon}
        </div>
      )}
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
