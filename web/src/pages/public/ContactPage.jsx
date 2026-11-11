import { useState } from "react";
import ContentHero from "../../components/public/ContentHero.jsx";
import * as Icons from "../../components/icons.jsx";
import { Card, Button, Field, Input, Textarea, Select, Alert, useToast } from "../../ui/index.js";

const CHANNELS = [
  { icon: Icons.IconMail, title: "Email", value: "hello@scamshield.lk", note: "We reply within 2 business days." },
  { icon: Icons.IconLifeBuoy, title: "Help centre", value: "Browse common questions", note: "Answers to most issues, instantly." },
  { icon: Icons.IconShieldAlert, title: "Report a scam", value: "Use the report form", note: "The fastest way to warn others." },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    toast({ tone: "success", title: "Message sent", description: "Thanks. We'll get back to you soon." });
  };

  return (
    <div>
      <ContentHero
        eyebrow="Contact"
        title="Get in touch"
        description="Questions, feedback, or a scam you'd like us to know about? We'd love to hear from you."
        icon={<Icons.IconMail className="h-3.5 w-3.5" />}
      />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Card className="p-6 sm:p-8">
            {sent ? (
              <div className="py-8 text-center">
                <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-legit-light text-legit">
                  <Icons.IconCheckCircle className="h-7 w-7" />
                </span>
                <h3 className="mt-4 text-section-title text-foreground">Message sent</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">Thanks for reaching out. We'll reply by email soon.</p>
                <Button variant="secondary" className="mt-5" onClick={() => setSent(false)}>
                  Send another
                </Button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name" required>
                    <Input required placeholder="Your name" />
                  </Field>
                  <Field label="Email" required>
                    <Input type="email" required placeholder="you@example.lk" leftIcon={<Icons.IconMail className="h-4 w-4" />} />
                  </Field>
                </div>
                <Field label="Topic">
                  <Select defaultValue="general">
                    <option value="general">General question</option>
                    <option value="feedback">Product feedback</option>
                    <option value="incorrect">A result looked wrong</option>
                    <option value="scam">Report a scam pattern</option>
                    <option value="research">Research / academic</option>
                  </Select>
                </Field>
                <Field label="Message" required>
                  <Textarea required rows={5} placeholder="How can we help?" />
                </Field>
                <Alert tone="info">Don't include OTPs, passwords, or card numbers in your message.</Alert>
                <Button type="submit" size="lg" leftIcon={<Icons.IconSend className="h-5 w-5" />}>
                  Send message
                </Button>
              </form>
            )}
          </Card>

          <div className="space-y-4">
            {CHANNELS.map((c) => (
              <Card key={c.title} className="flex gap-4 p-5">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <c.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-card-title text-foreground">{c.title}</h3>
                  <p className="mt-0.5 text-sm font-medium text-primary">{c.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.note}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
