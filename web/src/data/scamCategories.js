/**
 * Scam category taxonomy — realistic Sri Lankan SMS scam types. This is the
 * single source used by the public "Scam types" pages, the check/result flow's
 * category chips, and the admin category manager. Mirrors the report taxonomy
 * in lib/api.js (REPORT_CATEGORIES) so `slug` values line up with the backend
 * `category` field. Content is educational; all links are safe placeholders.
 */
export const SCAM_CATEGORIES = [
  {
    slug: "otp_fraud",
    name: "OTP fraud",
    icon: "IconKey",
    tone: "scam",
    tagline: "Tricking you into sharing a one-time password",
    summary:
      "Scammers pose as your bank, telecom, or a delivery service and pressure you into reading out an OTP or PIN, the exact code that authorises a transaction or account takeover.",
    howItWorks: [
      "You receive a call or SMS claiming there is a problem with your account, card, or a delivery.",
      "They create urgency: your account will be blocked, a payment failed, or a parcel is held.",
      "They ask you to confirm an OTP that was 'just sent', which actually authorises their transaction.",
    ],
    redFlags: [
      "Anyone asking you to read out an OTP, PIN, or CVV. No genuine bank or telecom ever will.",
      "Pressure to act 'within 5 minutes' or the account will be blocked.",
      "A caller who already knows some of your details, to sound legitimate.",
    ],
    example: {
      lang: "en",
      text: "Your account will be suspended. Verify now by sharing the 6-digit OTP sent to your phone. Call [PHONE REDACTED] immediately.",
    },
    safetyTips: [
      "Never share an OTP, PIN, or password, not even with someone claiming to be from your bank.",
      "Hang up and call the official number on the back of your card.",
      "Report the number to your bank's fraud line and to ScamShield LK.",
    ],
    stats: { reportsThisWeek: 42, trend: "+18%", trendDir: "up" },
  },
  {
    slug: "lottery_scam",
    name: "Lottery / prize",
    icon: "IconStar",
    tone: "scam",
    tagline: "You've 'won' something you never entered",
    summary:
      "A message says you've won a lottery, a phone, or a large cash prize from a telecom or bank promotion. To 'release' the prize you must first pay a fee or share bank details.",
    howItWorks: [
      "An SMS congratulates you on winning a draw, often citing a real-sounding telecom or bank promotion.",
      "You're told to pay a small 'processing', 'tax', or 'delivery' fee to claim the prize.",
      "Once you pay, the prize never arrives and the number goes silent or asks for more.",
    ],
    redFlags: [
      "Winning a competition you never entered.",
      "Being asked to pay any fee to receive a prize.",
      "Reload-card codes or bank transfers requested to 'verify' you.",
    ],
    example: {
      lang: "en",
      text: "Congratulations! Your number won Rs. 2,000,000 in the Dialog Anniversary Draw. To claim, send a Rs. 5,000 reload to [PHONE REDACTED] and reply with your NIC.",
    },
    safetyTips: [
      "Legitimate prizes never require an upfront payment.",
      "Verify any promotion directly with the company's official hotline.",
      "Never send reload codes or your NIC to unknown numbers.",
    ],
    stats: { reportsThisWeek: 37, trend: "+9%", trendDir: "up" },
  },
  {
    slug: "bank_transfer_scam",
    name: "Banking / bank transfer",
    icon: "IconCreditCard",
    tone: "scam",
    tagline: "Fake alerts about your account or a transfer",
    summary:
      "Messages impersonate your bank warning of a suspicious login, a blocked card, or a KYC update, pushing you to a fake link or hotline that harvests your credentials.",
    howItWorks: [
      "You get an SMS about unusual activity, a KYC/re-verification requirement, or a card block.",
      "It links to a page that looks like your bank's login, or a number that 'verifies' you.",
      "Entering your credentials or OTP hands the scammer full access to your account.",
    ],
    redFlags: [
      "Links to log in or 'update KYC' sent by SMS.",
      "Slightly-wrong sender names or shortened links.",
      "Requests for full card number, expiry, and CVV together.",
    ],
    example: {
      lang: "en",
      text: "Dear Customer, your account KYC is incomplete and will be frozen today. Update now: hxxps://example.invalid/kyc-verify",
    },
    safetyTips: [
      "Banks never send login or KYC links by SMS. Use the official app only.",
      "Type your bank's address yourself; don't tap links in messages.",
      "Call the number printed on your card if unsure.",
    ],
    stats: { reportsThisWeek: 51, trend: "+24%", trendDir: "up" },
  },
  {
    slug: "delivery_scam",
    name: "Delivery / courier",
    icon: "IconInbox",
    tone: "scam",
    tagline: "A parcel is 'held' pending a small fee",
    summary:
      "With online shopping common, scammers send fake courier notices claiming a parcel is stuck at customs or needs a redelivery fee, linking to a page that steals card details.",
    howItWorks: [
      "You receive an SMS about a parcel that couldn't be delivered or is held at customs.",
      "A small 'customs charge' or 'redelivery fee' is requested via a link.",
      "The payment page captures your card details for later fraud.",
    ],
    redFlags: [
      "Unexpected parcel notices when you're not awaiting delivery.",
      "Tiny fees (Rs. 50 to 300) designed to seem harmless.",
      "Links to pay, rather than payment on delivery.",
    ],
    example: {
      lang: "en",
      text: "Your parcel is held at customs. Pay the Rs. 250 clearance fee within 24h to release: hxxps://example.invalid/parcel",
    },
    safetyTips: [
      "Track parcels only through the courier's official app or website.",
      "Be suspicious of any fee requested by SMS link.",
      "Confirm with the seller before paying anything.",
    ],
    stats: { reportsThisWeek: 29, trend: "+31%", trendDir: "up" },
  },
  {
    slug: "loan_scam",
    name: "Loan scam",
    icon: "IconCreditCard",
    tone: "scam",
    tagline: "Instant loans with an upfront 'fee'",
    summary:
      "Offers of instant, no-documents loans target people under financial pressure. An upfront 'processing fee' or 'insurance' is demanded, after which the loan never appears.",
    howItWorks: [
      "An SMS offers a fast loan with no paperwork and instant approval.",
      "You're asked to pay a processing, insurance, or first-instalment fee upfront.",
      "After payment, the lender vanishes or demands further fees.",
    ],
    redFlags: [
      "Guaranteed approval with no documents or credit check.",
      "Any fee required before the loan is disbursed.",
      "Pressure and unofficial payment channels.",
    ],
    example: {
      lang: "en",
      text: "Instant loan up to Rs. 500,000 approved! No documents. Pay Rs. 3,500 processing fee to activate. Reply YES.",
    },
    safetyTips: [
      "Licensed lenders deduct fees from the loan, never upfront.",
      "Check the lender against the Central Bank's registered list.",
      "Walk away from any 'guaranteed' offer.",
    ],
    stats: { reportsThisWeek: 18, trend: "+4%", trendDir: "up" },
  },
  {
    slug: "job_scam",
    name: "Job / foreign employment",
    icon: "IconUser",
    tone: "scam",
    tagline: "Dream jobs abroad that demand fees first",
    summary:
      "Fake recruiters advertise high-paying jobs, often overseas, then charge for 'visa processing', 'registration', or 'training' before disappearing.",
    howItWorks: [
      "You see an SMS or social post about a well-paid job, frequently in the Gulf.",
      "After a quick 'interview', you're asked to pay agency, visa, or medical fees.",
      "The job doesn't exist; payments are lost and documents may be misused.",
    ],
    redFlags: [
      "Job offers with no proper interview or company verification.",
      "Fees for visa, registration, or training paid to personal accounts.",
      "Poorly-written messages and unofficial contact numbers.",
    ],
    example: {
      lang: "en",
      text: "URGENT hiring: Supermarket staff in Dubai, salary Rs. 250,000/month. Visa ready. Registration fee Rs. 15,000. WhatsApp [PHONE REDACTED].",
    },
    safetyTips: [
      "Verify agencies with the Sri Lanka Bureau of Foreign Employment (SLBFE).",
      "Never pay fees to a personal account.",
      "Real employers don't guarantee visas before selection.",
    ],
    stats: { reportsThisWeek: 23, trend: "+12%", trendDir: "up" },
  },
  {
    slug: "police_impersonation",
    name: "Police / government",
    icon: "IconShieldAlert",
    tone: "scam",
    tagline: "Threats from fake officials",
    summary:
      "Scammers impersonate police, courts, or government departments, claiming you're implicated in a crime or owe a fine, to frighten you into immediate payment.",
    howItWorks: [
      "A message or call claims to be from police, customs, or a court.",
      "You're accused of an offence or told a parcel in your name contains contraband.",
      "To 'clear your name', you must pay a fine or fee urgently and secretly.",
    ],
    redFlags: [
      "Officials demanding payment by phone or SMS.",
      "Instructions to keep it secret and act immediately.",
      "Threats of arrest to override your judgement.",
    ],
    example: {
      lang: "en",
      text: "This is CID. A case is filed against your NIC. Pay Rs. 25,000 fine to [ACCOUNT REDACTED] within 2 hours to avoid arrest.",
    },
    safetyTips: [
      "Government bodies never collect fines via SMS or phone transfers.",
      "Hang up and contact the institution through its official number.",
      "Never act in secret under pressure. Talk to someone you trust.",
    ],
    stats: { reportsThisWeek: 14, trend: "-6%", trendDir: "down" },
  },
  {
    slug: "subscription_scam",
    name: "Subscription / reload",
    icon: "IconSmartphone",
    tone: "spam",
    tagline: "Hidden charges and fake reload offers",
    summary:
      "Messages advertise 'free' data bundles, ringtones, or subscriptions that quietly deduct from your reload balance, or trick you into activating premium services.",
    howItWorks: [
      "An SMS promotes a free or heavily-discounted data/VAS bundle.",
      "Replying or dialling a code activates a recurring premium charge.",
      "Your reload balance drains with no clear way to unsubscribe.",
    ],
    redFlags: [
      "Offers that seem far too generous.",
      "Instructions to dial short codes to 'claim'.",
      "Charges appearing after replying to a promo.",
    ],
    example: {
      lang: "mixed",
      text: "FREE 10GB data! Dial *123*99# to activate now. Limited time offer, dan-ma register karanna!",
    },
    safetyTips: [
      "Activate bundles only from your telecom's official app or *#codes shown on their site.",
      "Check for and cancel unknown value-added services (VAS).",
      "Ignore promos that ask you to reply or dial unfamiliar codes.",
    ],
    stats: { reportsThisWeek: 26, trend: "+7%", trendDir: "up" },
  },
  {
    slug: "other",
    name: "Other / uncategorised",
    icon: "IconTag",
    tone: "neutral",
    tagline: "Suspicious messages that don't fit a common pattern",
    summary:
      "New scam patterns appear constantly. If a message feels off but doesn't match a known type, treat it with caution and report it so the community can be warned.",
    howItWorks: [
      "The message uses urgency, fear, or an unexpected reward.",
      "It asks for money, codes, or personal information.",
      "It comes from an unknown number or an unofficial channel.",
    ],
    redFlags: ["Unexpected requests for money or data.", "Unknown senders and unofficial links.", "Pressure to act fast."],
    example: {
      lang: "en",
      text: "Hi, I changed my number. Please save this and transfer the Rs. 40,000 we discussed to [ACCOUNT REDACTED] today.",
    },
    safetyTips: ["When in doubt, don't act.", "Verify through a known, official channel.", "Report it to help protect others."],
    stats: { reportsThisWeek: 11, trend: "+2%", trendDir: "up" },
  },
];

export const CATEGORY_BY_SLUG = Object.fromEntries(SCAM_CATEGORIES.map((c) => [c.slug, c]));

export function getCategory(slug) {
  return CATEGORY_BY_SLUG[slug] || null;
}
