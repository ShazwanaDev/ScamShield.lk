import ContentHero from "../../components/public/ContentHero.jsx";
import * as Icons from "../../components/icons.jsx";
import { Card } from "../../ui/index.js";

function LegalDoc({ eyebrow, title, updated, icon, sections }) {
  return (
    <div>
      <ContentHero eyebrow={eyebrow} title={title} description={`Last updated: ${updated}`} icon={icon} />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <Card className="p-6 sm:p-8">
          <div className="space-y-8">
            {sections.map((s, i) => (
              <section key={i}>
                <h2 className="text-section-title text-foreground">{s.h}</h2>
                {s.p?.map((p, j) => (
                  <p key={j} className="mt-3 text-[15px] leading-relaxed text-foreground-secondary">{p}</p>
                ))}
                {s.list && (
                  <ul className="mt-3 space-y-2">
                    {s.list.map((li, k) => (
                      <li key={k} className="flex items-start gap-2.5 text-[15px] text-foreground-secondary">
                        <Icons.IconCheck className="mt-1 h-4 w-4 shrink-0 text-primary" />
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </Card>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          This document is provided for a research/awareness project and is not legal advice.
        </p>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <LegalDoc
      eyebrow="Privacy & data protection"
      title="Privacy policy"
      updated="28 October 2026"
      icon={<Icons.IconLock className="h-3.5 w-3.5" />}
      sections={[
        {
          h: "Our approach",
          p: [
            "ScamShield LK is built to minimise the personal data it handles. Checking a message does not require an account. The messages you check are stored, but never shared with third parties or sold.",
          ],
        },
        {
          h: "What we process",
          p: ["Depending on how you use the service, we may process:"],
          list: [
            "The text of messages you submit for classification. It is stored on our server with the result, so the model's accuracy can be measured and improved.",
            "Optional account details (email) if you choose to register.",
            "Reports you submit to the community moderation queue.",
            "Basic, non-identifying usage information to improve the service.",
          ],
        },
        {
          h: "How long we keep it",
          p: [
            "ScamShield LK is a research project and there is no automatic deletion yet. Checked messages and reports stay on the server until the project team removes them.",
          ],
        },
        {
          h: "What you should not submit",
          p: [
            "Please redact sensitive details before checking or reporting a message: OTPs, passwords, full card numbers, and your NIC. You never need to share these to get a useful result.",
          ],
        },
        {
          h: "Your choices",
          list: [
            "Use the checker without an account.",
            "Delete your local history at any time from settings.",
            "Request export or deletion of account data where applicable.",
          ],
        },
        {
          h: "Contact",
          p: ["For any privacy question, contact us at privacy@scamshield.lk."],
        },
      ]}
    />
  );
}

export function TermsPage() {
  return (
    <LegalDoc
      eyebrow="Terms of use"
      title="Terms of use"
      updated="21 July 2026"
      icon={<Icons.IconFileText className="h-3.5 w-3.5" />}
      sections={[
        {
          h: "Acceptance",
          p: ["By using ScamShield LK, you agree to these terms. If you don't agree, please don't use the service."],
        },
        {
          h: "What the service is",
          p: [
            "ScamShield LK is a scam-awareness tool that estimates whether an SMS is a scam, spam, or legitimate. It is provided for informational purposes as part of a research project.",
          ],
        },
        {
          h: "No guarantee of accuracy",
          p: [
            "No automated detector is perfect. Results are guidance, not a definitive judgement. Always verify important messages through official channels, and never make financial or security decisions based solely on a result here.",
          ],
        },
        {
          h: "Acceptable use",
          list: [
            "Don't use the service for unlawful purposes.",
            "Don't attempt to disrupt, overload, or reverse-engineer the service.",
            "Don't submit others' personal data without a lawful basis.",
          ],
        },
        {
          h: "Not affiliated",
          p: [
            "ScamShield LK is independent and not affiliated with any bank, telecom, or government agency. Names of organisations are used only to describe scam patterns.",
          ],
        },
        {
          h: "Changes",
          p: ["We may update these terms as the project evolves. Continued use means you accept the updated terms."],
        },
      ]}
    />
  );
}
