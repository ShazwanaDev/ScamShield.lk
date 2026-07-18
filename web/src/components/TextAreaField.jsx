export default function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  maxLength,
  hint,
  required,
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-foreground">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
        {maxLength && (
          <span className="text-xs text-muted-foreground">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        id={id}
        rows={rows}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-card p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
