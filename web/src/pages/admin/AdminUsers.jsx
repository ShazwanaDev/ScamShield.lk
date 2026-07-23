import { useMemo, useState } from "react";
import { USERS } from "../../data/admin.js";
import { paginate } from "../../data/store.js";
import { PageHeader, DataTable, Pagination, SearchInput, Select, Badge, Avatar, Modal, Button, EmptyState, useToast } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const ROLE_TONE = { admin: "info", moderator: "teal", user: "neutral" };
const STATUS_TONE = { active: "legit", suspended: "scam" };

export default function AdminUsers() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState(null);
  const [sort, setSort] = useState({ key: "joined", dir: "desc" });

  const filtered = useMemo(
    () =>
      USERS.filter((u) => {
        if (role && u.role !== role) return false;
        if (query && !u.name.toLowerCase().includes(query.toLowerCase()) && !u.email.toLowerCase().includes(query.toLowerCase())) return false;
        return true;
      }),
    [query, role],
  );

  const { rows, total, pageCount, page: p } = paginate(filtered, { page, pageSize: 8, sort });
  const doSort = (key) => setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));

  const columns = [
    {
      key: "name",
      header: "User",
      primary: true,
      sortable: true,
      cell: (u) => (
        <div className="flex items-center gap-3">
          <Avatar name={u.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{u.name}</p>
            <p className="truncate text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: "role", header: "Role", cell: (u) => <Badge tone={ROLE_TONE[u.role]} size="sm" className="capitalize">{u.role}</Badge> },
    { key: "status", header: "Status", cell: (u) => <Badge tone={STATUS_TONE[u.status]} size="sm" className="capitalize">{u.status}</Badge> },
    { key: "checks", header: "Checks", sortable: true, align: "right", cell: (u) => <span className="tabular-nums">{u.checks}</span> },
    { key: "reports", header: "Reports", align: "right", cell: (u) => <span className="tabular-nums">{u.reports}</span> },
    { key: "joined", header: "Joined", sortable: true, align: "right", cell: (u) => <span className="text-xs text-muted-foreground">{u.joined}</span> },
  ];

  const toggleSuspend = () => {
    toast({ tone: "warning", title: active.status === "active" ? "User suspended" : "User reactivated", description: active.name });
    setActive(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Manage accounts, roles, and access." icon={<Icons.IconUsers className="h-5 w-5" />} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-xs">
          <SearchInput value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search users…" />
        </div>
        <div className="sm:w-44">
          <Select value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }} size="sm">
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </Select>
        </div>
      </div>

      <DataTable columns={columns} rows={rows} sort={sort} onSort={doSort} onRowClick={setActive} empty={<EmptyState icon={<Icons.IconUsers className="h-7 w-7" />} title="No users found" />} />
      <Pagination page={p} pageCount={pageCount} onPage={setPage} totalLabel={`${total} users`} />

      <Modal open={!!active} onClose={() => setActive(null)} title="User details" footer={active && (
        <>
          <Button variant="secondary" onClick={() => setActive(null)}>Close</Button>
          <Button variant={active.status === "active" ? "danger" : "success"} onClick={toggleSuspend}>
            {active.status === "active" ? "Suspend" : "Reactivate"}
          </Button>
        </>
      )}>
        {active && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={active.name} size="lg" className="h-14 w-14" />
              <div>
                <p className="text-lg font-bold text-foreground">{active.name}</p>
                <p className="text-sm text-muted-foreground">{active.email}</p>
                <div className="mt-1.5 flex gap-2">
                  <Badge tone={ROLE_TONE[active.role]} size="sm" className="capitalize">{active.role}</Badge>
                  <Badge tone={STATUS_TONE[active.status]} size="sm" className="capitalize">{active.status}</Badge>
                </div>
              </div>
            </div>
            <dl className="grid grid-cols-3 gap-3 rounded-lg border border-border p-4 text-center">
              <div><dt className="text-xs text-muted-foreground">Checks</dt><dd className="text-lg font-bold text-foreground">{active.checks}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Reports</dt><dd className="text-lg font-bold text-foreground">{active.reports}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Joined</dt><dd className="text-sm font-semibold text-foreground">{active.joined}</dd></div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
}
