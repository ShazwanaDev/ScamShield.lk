import { cn } from "./cn.js";
import { Skeleton } from "./feedback.jsx";
import { IconSort, IconChevronUp, IconChevronDown } from "../components/icons.jsx";

/**
 * DataTable — a responsive table that renders as a real <table> on md+ and
 * collapses each row into a stacked card on small screens. Columns declare an
 * optional `cell(row)` renderer, `header`, `sortable`, and `primary` (used as
 * the card title on mobile).
 *
 * Fully presentational: sorting/pagination/filtering state lives in the page.
 */
export function DataTable({
  columns,
  rows,
  rowKey = (r, i) => r.id ?? i,
  loading = false,
  skeletonRows = 6,
  sort,
  onSort,
  onRowClick,
  empty,
  className,
}) {
  const showEmpty = !loading && rows.length === 0;

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-surface", className)}>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto scrollbar-thin md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background-secondary/60 text-left">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn("px-4 py-3 font-semibold text-foreground-secondary", col.align === "right" && "text-right", col.className)}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => onSort?.(col.key)}
                      className="inline-flex items-center gap-1.5 transition hover:text-foreground"
                    >
                      {col.header}
                      {sort?.key === col.key ? (
                        sort.dir === "asc" ? (
                          <IconChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <IconChevronDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <IconSort className="h-3.5 w-3.5 opacity-40" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading &&
              Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={`sk${i}`}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5">
                      <Skeleton className="h-4 w-24" />
                    </td>
                  ))}
                </tr>
              ))}
            {!loading &&
              rows.map((row, i) => (
                <tr
                  key={rowKey(row, i)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn("transition", onRowClick && "cursor-pointer hover:bg-background-secondary/60")}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3.5 text-foreground", col.align === "right" && "text-right", col.cellClassName)}>
                      {col.cell ? col.cell(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="divide-y divide-border md:hidden">
        {loading &&
          Array.from({ length: skeletonRows }).map((_, i) => (
            <div key={`msk${i}`} className="space-y-2 p-4">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3.5 w-2/3" />
            </div>
          ))}
        {!loading &&
          rows.map((row, i) => {
            const primaryCol = columns.find((c) => c.primary) || columns[0];
            const rest = columns.filter((c) => c !== primaryCol && !c.hideOnCard);
            return (
              <div
                key={rowKey(row, i)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn("p-4", onRowClick && "cursor-pointer active:bg-background-secondary")}
              >
                <div className="mb-2 font-semibold text-foreground">
                  {primaryCol.cell ? primaryCol.cell(row) : row[primaryCol.key]}
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                  {rest.map((col) => (
                    <div key={col.key} className="min-w-0">
                      <dt className="text-xs text-muted-foreground">{col.header}</dt>
                      <dd className="truncate text-foreground">{col.cell ? col.cell(row) : row[col.key]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
      </div>

      {showEmpty && <div className="p-2">{empty}</div>}
    </div>
  );
}
