import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { clearHistory } from "../../lib/history.js";
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Field,
  Input,
  RadioCard,
  Switch,
  Alert,
  ConfirmDialog,
  useToast,
} from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

const LANGS = [
  { value: "en", label: "English", hint: "English UI" },
  { value: "si", label: "සිංහල", hint: "Sinhala UI" },
  { value: "ta", label: "தமிழ்", hint: "Tamil UI" },
];

function Section({ id, icon: Icon, title, description, children }) {
  return (
    <Card id={id} className="scroll-mt-20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

export default function AppSettings() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [lang, setLang] = useState("en");
  const [prefs, setPrefs] = useState({
    notifAlerts: true,
    notifReports: true,
    notifNews: false,
    saveHistory: true,
    analytics: false,
    reduceMotion: false,
    largeText: false,
    preferOffline: false,
  });
  const [confirm, setConfirm] = useState(null); // 'clear' | 'delete' | 'logout'

  const set = (k) => (v) => setPrefs((p) => ({ ...p, [k]: v }));
  const notify = (msg) => toast({ tone: "success", title: msg });

  const onConfirm = () => {
    if (confirm === "clear") {
      clearHistory(user?.email);
      notify("History cleared");
    } else if (confirm === "logout") {
      logout();
      navigate("/");
      return;
    } else if (confirm === "delete") {
      clearHistory(user?.email);
      logout();
      navigate("/");
      return;
    }
    setConfirm(null);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Manage your account, preferences, privacy, and data." icon={<Icons.IconSettings className="h-5 w-5" />} />

      <Section id="security" icon={Icons.IconLock} title="Account security" description="Update your password.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Current password">
            <Input type="password" placeholder="••••••••" />
          </Field>
          <div className="hidden sm:block" />
          <Field label="New password">
            <Input type="password" placeholder="At least 8 characters" />
          </Field>
          <Field label="Confirm new password">
            <Input type="password" placeholder="Re-enter password" />
          </Field>
        </div>
        <Button onClick={() => notify("Password updated")}>Update password</Button>
      </Section>

      <Section id="language" icon={Icons.IconLanguages} title="Language" description="Choose your interface language.">
        <div className="grid gap-3 sm:grid-cols-3">
          {LANGS.map((l) => (
            <RadioCard key={l.value} name="lang" value={l.value} label={l.label} hint={l.hint} checked={lang === l.value} onChange={() => setLang(l.value)} />
          ))}
        </div>
      </Section>

      <Section id="notifications" icon={Icons.IconBell} title="Notifications" description="Pick what you want to hear about.">
        <Switch label="Community scam alerts" hint="High-severity scams spreading in Sri Lanka" checked={prefs.notifAlerts} onChange={set("notifAlerts")} />
        <Switch label="Report updates" hint="When your reports are reviewed" checked={prefs.notifReports} onChange={set("notifReports")} />
        <Switch label="News & awareness" hint="New articles and product updates" checked={prefs.notifNews} onChange={set("notifNews")} />
      </Section>

      <Section id="privacy" icon={Icons.IconShieldCheck} title="Privacy" description="Control how your data is used.">
        <Switch label="Save my check history" hint="Keep a private history on this account" checked={prefs.saveHistory} onChange={set("saveHistory")} />
        <Switch label="Anonymous usage analytics" hint="Help improve the product with non-identifying data" checked={prefs.analytics} onChange={set("analytics")} />
      </Section>

      <Section id="accessibility" icon={Icons.IconEye} title="Accessibility" description="Make the app easier to use.">
        <Switch label="Reduce motion" hint="Minimise animations and transitions" checked={prefs.reduceMotion} onChange={set("reduceMotion")} />
        <Switch label="Larger text" hint="Increase text size across the app" checked={prefs.largeText} onChange={set("largeText")} />
      </Section>

      <Section id="offline" icon={Icons.IconWifiOff} title="Offline model" description="On-device checking (mobile app).">
        <Alert tone="info">The Android app can check messages offline using an on-device model. This preference syncs to your mobile app.</Alert>
        <Switch label="Prefer offline model" hint="Always use the on-device model, even when connected" checked={prefs.preferOffline} onChange={set("preferOffline")} />
      </Section>

      <Section id="data" icon={Icons.IconDatabase} title="Your data" description="Export or clear your information.">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" leftIcon={<Icons.IconDownload className="h-4 w-4" />} onClick={() => notify("Export started. Check your email.")}>
            Export my data
          </Button>
          <Button variant="danger-outline" leftIcon={<Icons.IconTrash className="h-4 w-4" />} onClick={() => setConfirm("clear")}>
            Clear check history
          </Button>
        </div>
      </Section>

      <Card className="border-scam/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-scam-light text-scam">
              <Icons.IconAlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <CardTitle>Account</CardTitle>
              <CardDescription>Sign out or permanently delete your account.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="secondary" leftIcon={<Icons.IconLogout className="h-4 w-4" />} onClick={() => setConfirm("logout")}>
            Sign out
          </Button>
          <Button variant="danger" leftIcon={<Icons.IconTrash className="h-4 w-4" />} onClick={() => setConfirm("delete")}>
            Delete account
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirm != null}
        onClose={() => setConfirm(null)}
        onConfirm={onConfirm}
        tone={confirm === "logout" ? "primary" : "danger"}
        title={confirm === "clear" ? "Clear all history?" : confirm === "logout" ? "Sign out?" : "Delete your account?"}
        description={
          confirm === "clear"
            ? "This permanently removes every saved check on this account."
            : confirm === "logout"
              ? "You'll need to sign in again to access your history and reports."
              : "This permanently deletes your account and all associated data. This cannot be undone."
        }
        confirmLabel={confirm === "clear" ? "Clear history" : confirm === "logout" ? "Sign out" : "Delete account"}
      />
    </div>
  );
}
