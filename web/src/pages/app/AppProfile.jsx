import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { getHistory } from "../../lib/history.js";
import { getMyReports } from "../../lib/myReports.js";
import { PageHeader, Card, CardHeader, CardTitle, CardContent, Button, Avatar, Field, Input, Badge, useToast } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

export default function AppProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || user?.email?.split("@")[0] || "");

  const checks = getHistory(user?.email).length;
  const reports = getMyReports(user?.email).length;

  const save = (e) => {
    e.preventDefault();
    setEditing(false);
    toast({ tone: "success", title: "Profile updated" });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Profile" description="Your account details and activity." icon={<Icons.IconUser className="h-5 w-5" />} />

      <Card className="p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <Avatar name={user?.name || user?.email || "User"} size="lg" className="h-16 w-16 text-lg" />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-foreground">{name}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <Badge tone="primary" size="sm" className="mt-2">Member</Badge>
          </div>
          <Button variant="secondary" onClick={() => setEditing((e) => !e)} leftIcon={<Icons.IconEdit className="h-4 w-4" />}>
            {editing ? "Cancel" : "Edit profile"}
          </Button>
        </div>

        {editing && (
          <form onSubmit={save} className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
            <Field label="Display name">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Email" hint="Contact support to change your email">
              <Input value={user?.email || ""} disabled leftIcon={<Icons.IconMail className="h-4 w-4" />} />
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit" leftIcon={<Icons.IconCheck className="h-4 w-4" />}>Save changes</Button>
            </div>
          </form>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex items-center gap-4 p-5">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icons.IconShieldCheck className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-bold text-foreground">{checks}</p>
            <p className="text-sm text-muted-foreground">Messages checked</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-scam-light text-scam">
            <Icons.IconFlag className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-bold text-foreground">{reports}</p>
            <p className="text-sm text-muted-foreground">Reports submitted</p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {[
              { label: "Settings & preferences", to: "/app/settings", icon: Icons.IconSettings },
              { label: "Notifications", to: "/app/notifications", icon: Icons.IconBell },
              { label: "Help centre", to: "/help", icon: Icons.IconLifeBuoy },
            ].map((r) => (
              <li key={r.to}>
                <Link to={r.to} className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-background-secondary/50">
                  <r.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="flex-1 text-sm font-medium text-foreground">{r.label}</span>
                  <Icons.IconChevronRight className="h-4 w-4 text-border-strong" />
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
