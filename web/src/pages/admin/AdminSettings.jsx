import { useState } from "react";
import { PageHeader, Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Field, Input, Select, Switch, Alert, useToast } from "../../ui/index.js";
import * as Icons from "../../components/icons.jsx";

function Section({ icon: Icon, title, description, children }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
          <div><CardTitle>{title}</CardTitle>{description && <CardDescription>{description}</CardDescription>}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

export default function AdminSettings() {
  const { toast } = useToast();
  const [threshold, setThreshold] = useState(60);
  const [flags, setFlags] = useState({ mbert: false, offlineExport: true, community: true, maintenance: false });
  const set = (k) => (v) => setFlags((f) => ({ ...f, [k]: v }));
  const save = () => toast({ tone: "success", title: "Settings saved" });

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Platform configuration for classification, data, security, and features." icon={<Icons.IconSliders className="h-5 w-5" />} actions={<Button onClick={save} leftIcon={<Icons.IconCheck className="h-4 w-4" />}>Save changes</Button>} />

      <Section icon={Icons.IconGauge} title="Classification" description="Thresholds that shape how verdicts are decided.">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <label htmlFor="thr" className="font-medium text-foreground">Low-confidence threshold</label>
            <span className="font-semibold tabular-nums text-primary">{threshold}%</span>
          </div>
          <input id="thr" type="range" min={50} max={90} value={threshold} onChange={(e) => setThreshold(+e.target.value)} className="w-full accent-[#FF3B30]" />
          <p className="mt-1 text-xs text-muted-foreground">Predictions below this confidence are shown as "low confidence" rather than a firm verdict.</p>
        </div>
        <Field label="Default active model">
          <Select defaultValue="tfidf-logreg">
            <option value="tfidf-logreg">TF-IDF + Logistic Regression</option>
            <option value="tfidf-svm">TF-IDF + Linear SVM</option>
            <option value="mbert">mBERT (experimental)</option>
          </Select>
        </Field>
      </Section>

      <Section icon={Icons.IconLanguages} title="Languages" description="Which languages the pipeline recognises.">
        <div className="grid gap-3 sm:grid-cols-2">
          {["English", "Sinhala", "Tamil", "Singlish / code-mixed"].map((l) => (
            <Switch key={l} label={l} checked onChange={() => {}} />
          ))}
        </div>
      </Section>

      <Section icon={Icons.IconDatabase} title="Data retention" description="How long records are kept.">
        <Field label="Classification history retention">
          <Select defaultValue="180"><option value="90">90 days</option><option value="180">180 days</option><option value="365">1 year</option><option value="0">Indefinite</option></Select>
        </Field>
        <Field label="Report retention">
          <Select defaultValue="365"><option value="180">180 days</option><option value="365">1 year</option><option value="0">Indefinite</option></Select>
        </Field>
      </Section>

      <Section icon={Icons.IconKey} title="Security" description="Access and privacy controls.">
        <Alert tone="info" title="How admin access works">Admin sign-in is checked by the server, and the moderation API refuses requests without its signed session token. The switches below are sample settings and are not saved yet.</Alert>
        <Switch label="Require 2FA for admins" hint="Second factor on every admin sign-in" checked onChange={() => {}} />
        <Switch label="Redact PII in logs" hint="Strip OTPs, cards, NIC from stored logs" checked onChange={() => {}} />
      </Section>

      <Section icon={Icons.IconZap} title="Feature flags" description="Toggle experimental capabilities.">
        <Switch label="mBERT inference" hint="Use the transformer model in production" checked={flags.mbert} onChange={set("mbert")} />
        <Switch label="Offline model export" hint="Allow TFLite model downloads to the mobile app" checked={flags.offlineExport} onChange={set("offlineExport")} />
        <Switch label="Community reporting" hint="Let users submit reports" checked={flags.community} onChange={set("community")} />
        <Switch label="Maintenance mode" hint="Show a maintenance page to all users" checked={flags.maintenance} onChange={set("maintenance")} />
      </Section>
    </div>
  );
}
