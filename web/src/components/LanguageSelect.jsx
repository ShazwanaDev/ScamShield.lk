import { REPORT_LANGUAGES } from "../lib/api.js";

export default function LanguageSelect({ id, label, value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="">Not sure / prefer not to say</option>
        {REPORT_LANGUAGES.map((l) => (
          <option key={l.value} value={l.value}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
