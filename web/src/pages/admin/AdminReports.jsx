import { useMemo, useState } from "react";
import { MOD_REPORTS } from "../../data/admin.js";
import { CATEGORY_BY_SLUG } from "../../data/scamCategories.js";
import { paginate } from "../../data/store.js";
import { PageHeader, Card, DataTable, Pagination, SearchInput, Select, Badge, EmptyState, cn } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const STATUS = { pending: "spam", approved: "legit", rejected: "scam" };
const LANG = { en: "English", si: "Sinhala", ta: "Tamil", mixed: "Singlish" };

export default function AdminReports() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: "submittedAt", dir: "desc" });

  const filtered = useMemo(() => {
    return MOD_REPORTS.filter((r) => {
      if (status && r.status !== status) return false;
      if (query && !r.message.toLowerCase().includes(query.toLowerCase()) && !r.id.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, status]);

  const { rows, total, pageCount, page: p } = paginate(filtered, { page, pageSize: 8, sort });

  const columns = [
    { key: "id", header: "ID", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: "message", header: "Message", primary: true, cell: (r) => <span className="line-clamp-1 max-w-sm text-sm">{r.message}</span> },
    { key: "category", header: "Category", cell: (r) => CATEGORY_BY_SLUG[r.category]?.name || r.category },
    { key: "language", header: "Lang", cell: (r) => LANG[r.language] || r.language },
    { key: "status", header: "Status", sortable: true, cell: (r) => <Badge tone={STATUS[r.status]} size="sm" className="capitalize">{r.status}</Badge> },
    { key: "submittedAt", header: "Submitted", sortable: true, align: "right", cell: (r) => <span className="text-xs text-muted-foreground">{new Date(r.submittedAt).toLocaleDateString()}</span> },
  ];

  const doSort = (key) => setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));

  return (
    <div className="space-y-6">
      <PageHeader title="Scam reports" description="Every community report across all statuses." icon={<Icons.IconFlag className="h-5 w-5" />} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-xs">
          <SearchInput value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search reports…" />
        </div>
        <div className="sm:w-44">
          <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} size="sm">
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        sort={sort}
        onSort={doSort}
        empty={<EmptyState icon={<Icons.IconFlag className="h-7 w-7" />} title="No reports found" description="Adjust your search or filter." />}
      />
      <Pagination page={p} pageCount={pageCount} onPage={setPage} totalLabel={`${total} report${total !== 1 ? "s" : ""}`} />
    </div>
  );
}
