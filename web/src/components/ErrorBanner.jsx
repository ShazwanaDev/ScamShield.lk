import { IconAlertTriangle } from "./icons.jsx";

export default function ErrorBanner({ children, action }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm text-danger"
    >
      <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1">{children}</div>
      {action}
    </div>
  );
}
