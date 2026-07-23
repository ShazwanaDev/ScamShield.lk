/** Community scam alerts — moderator-published warnings. Safe placeholders. */
export const ALERTS = [
  {
    id: "AL-2041",
    title: "Fake 'Dialog anniversary draw' reload scam spreading",
    severity: "high",
    category: "lottery_scam",
    region: "Nationwide",
    date: "2026-07-21",
    reports: 128,
    status: "active",
    summary:
      "A wave of SMS claiming a Rs. 2,000,000 anniversary prize is asking recipients to send reload codes to claim. No such promotion exists.",
    details: [
      "The message impersonates a well-known telecom's anniversary draw and congratulates you on winning a large cash prize.",
      "Victims are told to send a Rs. 5,000 reload and reply with their NIC to 'release' the prize.",
      "Once the reload is sent, the number stops responding. No prize is ever paid.",
    ],
    example: "Congratulations! Your number won Rs. 2,000,000 in the Anniversary Draw. Send a Rs. 5,000 reload to [PHONE REDACTED] and reply with NIC.",
    advice: ["Legitimate prizes never require an upfront payment.", "Never send reload codes or your NIC to unknown numbers."],
  },
  {
    id: "AL-2039",
    title: "Bank 'KYC will be frozen today' phishing links",
    severity: "high",
    category: "bank_transfer_scam",
    region: "Nationwide",
    date: "2026-07-20",
    reports: 96,
    status: "active",
    summary:
      "Messages impersonating multiple banks warn that KYC is incomplete and the account will be frozen, linking to fake login pages.",
    details: [
      "The SMS uses urgency ('frozen today') and links to a page mimicking a bank login.",
      "Entering credentials or an OTP on the fake page gives scammers account access.",
    ],
    example: "Dear Customer, your account KYC is incomplete and will be frozen today. Update now: hxxps://example.invalid/kyc-verify",
    advice: ["Banks never send login/KYC links by SMS.", "Only use the official banking app; type addresses yourself."],
  },
  {
    id: "AL-2036",
    title: "Parcel 'customs clearance fee' texts targeting online shoppers",
    severity: "medium",
    category: "delivery_scam",
    region: "Western Province",
    date: "2026-07-18",
    reports: 61,
    status: "active",
    summary: "Fake courier SMS ask for a small clearance fee via a link that captures card details.",
    details: [
      "Recipients are told a parcel is held at customs and a Rs. 250 fee must be paid within 24 hours.",
      "The linked payment page harvests full card details.",
    ],
    example: "Your parcel is held at customs. Pay the Rs. 250 clearance fee within 24h to release: hxxps://example.invalid/parcel",
    advice: ["Track parcels only via the official courier app.", "Never pay a fee requested through an SMS link."],
  },
  {
    id: "AL-2030",
    title: "Fake CID 'case filed against your NIC' extortion calls",
    severity: "high",
    category: "police_impersonation",
    region: "Nationwide",
    date: "2026-07-14",
    reports: 44,
    status: "monitoring",
    summary: "Callers impersonating CID claim a case is filed and demand an urgent 'fine' to avoid arrest.",
    details: [
      "The caller accuses you of an offence linked to your NIC and threatens immediate arrest.",
      "You're pressured to transfer a 'fine' secretly and urgently.",
    ],
    example: "This is CID. A case is filed against your NIC. Pay Rs. 25,000 fine to [ACCOUNT REDACTED] within 2 hours to avoid arrest.",
    advice: ["Authorities never collect fines by phone or SMS.", "Hang up and call the institution's official number."],
  },
  {
    id: "AL-2025",
    title: "'Free 10GB data' premium-service activation trap",
    severity: "low",
    category: "subscription_scam",
    region: "Nationwide",
    date: "2026-07-09",
    reports: 33,
    status: "resolved",
    summary: "Promo SMS offering free data trick users into dialling codes that activate recurring premium charges.",
    details: [
      "Dialling the advertised short code activates a paid value-added service.",
      "The reload balance drains with no clear unsubscribe path.",
    ],
    example: "FREE 10GB data! Dial *123*99# to activate now. Limited time offer!",
    advice: ["Activate bundles only from the official telecom app.", "Check for and cancel unknown VAS subscriptions."],
  },
  {
    id: "AL-2018",
    title: "Overseas job offers demanding upfront 'visa fees'",
    severity: "medium",
    category: "job_scam",
    region: "Nationwide",
    date: "2026-07-02",
    reports: 27,
    status: "monitoring",
    summary: "Fake recruiters advertise Gulf jobs and demand registration/visa fees to personal accounts.",
    details: [
      "A well-paid overseas job is offered with a quick 'interview'.",
      "Registration, visa, or medical fees are demanded before the (non-existent) job.",
    ],
    example: "URGENT hiring: Supermarket staff in Dubai, salary Rs. 250,000/month. Registration fee Rs. 15,000. WhatsApp [PHONE REDACTED].",
    advice: ["Verify agencies with the SLBFE.", "Never pay job fees to a personal account."],
  },
];

export const SEVERITY = {
  high: { label: "High", tone: "scam" },
  medium: { label: "Medium", tone: "spam" },
  low: { label: "Low", tone: "warning" },
};

export const ALERT_STATUS = {
  active: { label: "Active", tone: "scam" },
  monitoring: { label: "Monitoring", tone: "spam" },
  resolved: { label: "Resolved", tone: "legit" },
};

export const ALERT_BY_ID = Object.fromEntries(ALERTS.map((a) => [a.id, a]));
export function getAlert(id) {
  return ALERT_BY_ID[id] || null;
}
