/** Awareness hub articles. Educational content; safe placeholder links only. */
export const ARTICLES = [
  {
    slug: "spot-a-scam-sms-in-10-seconds",
    title: "How to spot a scam SMS in 10 seconds",
    category: "Basics",
    tone: "primary",
    readMins: 4,
    published: "2026-07-18",
    author: "ScamShield LK Team",
    excerpt:
      "Four quick checks catch the vast majority of scam texts: urgency, unexpected rewards, requests for codes or money, and unofficial links.",
    tags: ["basics", "otp", "links"],
    sections: [
      {
        heading: "The 10-second checklist",
        body: [
          "Most scam SMS share the same DNA. Before you tap anything, run these four checks:",
        ],
        list: [
          "Urgency: 'act within 2 hours', 'account will be blocked today'. Pressure is designed to stop you thinking.",
          "Unexpected reward or problem: a prize you never entered, or a parcel you never ordered.",
          "A request for a code, PIN, password, NIC, or money.",
          "A link or number that isn't your provider's official one.",
        ],
      },
      {
        heading: "If two or more match…",
        body: [
          "Treat the message as a scam until proven otherwise. Don't click, don't call the number in the message, and don't reply.",
          "Instead, contact the organisation using a number you already trust, such as the one on the back of your card, or their official app.",
        ],
      },
      {
        heading: "When you're not sure",
        body: [
          "Paste the message into ScamShield LK. It highlights the exact words that make a message risky, in Sinhala, Tamil, English, or a mix, so you learn what to look for next time.",
        ],
      },
    ],
  },
  {
    slug: "never-share-your-otp",
    title: "Why you should never share your OTP, even with 'the bank'",
    category: "Banking",
    tone: "scam",
    readMins: 5,
    published: "2026-07-15",
    author: "ScamShield LK Team",
    excerpt:
      "An OTP is the key to your account. Genuine banks and telecoms never ask you to read one out. Here's how the trick works and how to shut it down.",
    tags: ["otp", "banking"],
    sections: [
      {
        heading: "What an OTP actually does",
        body: [
          "A one-time password authorises a specific action: a login, a transfer, a card registration. Whoever holds the OTP at that moment can complete that action.",
          "That's why sharing it is exactly like handing over the transaction itself.",
        ],
      },
      {
        heading: "The classic script",
        body: ["The scammer initiates a transaction on your account, then calls you:"],
        list: [
          "'We noticed suspicious activity and need to verify you.'",
          "'You'll receive a code now. Read it back to confirm it's really you.'",
          "The code you read out authorises their transaction, not a verification.",
        ],
      },
      {
        heading: "Shut it down",
        body: [
          "Hang up. No legitimate institution will ever ask for an OTP, PIN, CVV, or password by phone or SMS.",
          "Call your bank's official hotline and report the attempt. Then report the number to ScamShield LK to warn others.",
        ],
      },
    ],
  },
  {
    slug: "protecting-elders-from-sms-scams",
    title: "Helping parents and elders avoid SMS scams",
    category: "Family safety",
    tone: "teal",
    readMins: 6,
    published: "2026-07-10",
    author: "ScamShield LK Team",
    excerpt:
      "Older relatives are frequent targets. A few simple habits and a shared 'pause and check' rule protect the whole family.",
    tags: ["family", "basics"],
    sections: [
      {
        heading: "Agree on a family rule",
        body: [
          "The single most effective defence is a 'pause and check' rule: any message about money, prizes, or account problems gets shown to a trusted family member before any action.",
        ],
      },
      {
        heading: "Set up the basics together",
        body: ["Spend ten minutes setting these up on their phone:"],
        list: [
          "Save official bank and telecom hotlines as contacts, so real ones are recognisable.",
          "Turn on caller ID and spam filters where available.",
          "Bookmark ScamShield LK so a suspicious message can be checked in seconds.",
        ],
      },
      {
        heading: "Normalise reporting",
        body: [
          "Reassure them that falling for a scam, or nearly falling for one, is nothing to be ashamed of. The goal is to check early and report, so the next person is warned too.",
        ],
      },
    ],
  },
  {
    slug: "code-mixed-scams-sinhala-tamil-english",
    title: "Scams don't stick to one language, and neither do we",
    category: "Multilingual",
    tone: "info",
    readMins: 5,
    published: "2026-07-05",
    author: "ScamShield LK Team",
    excerpt:
      "Sri Lankan scam texts mix Sinhala, Tamil, English and romanised 'Singlish'. Filters built only for English miss most of them.",
    tags: ["multilingual", "research"],
    sections: [
      {
        heading: "Why language matters",
        body: [
          "A message like 'Free 10GB, dan-ma activate karanna' blends English and romanised Sinhala. English-only spam filters simply don't see it.",
          "ScamShield LK is built for exactly this reality: Sinhala script, Tamil script, English, Singlish, Thanglish, and code-mixed text.",
        ],
      },
      {
        heading: "What to watch for across languages",
        body: ["The tactics are universal even when the words change:"],
        list: [
          "Urgency and threats ('ikmanata', 'immediately', 'உடனடியாக').",
          "Free offers and prizes ('නොමිලේ', 'free', 'இலவசம்').",
          "Requests for codes, NIC, or reloads in any language.",
        ],
      },
    ],
  },
  {
    slug: "you-were-scammed-what-now",
    title: "You think you were scammed: what to do in the first hour",
    category: "Recovery",
    tone: "scam",
    readMins: 4,
    published: "2026-06-28",
    author: "ScamShield LK Team",
    excerpt: "Fast action limits the damage. A clear, calm checklist for the critical first hour after a scam.",
    tags: ["recovery", "banking"],
    sections: [
      {
        heading: "Act fast, in order",
        body: ["If you shared card details, an OTP, or made a transfer:"],
        list: [
          "Call your bank's 24-hour hotline immediately and freeze the card or account.",
          "Change passwords for any account whose details you shared.",
          "Keep the message and any receipts as evidence, screenshots included.",
          "Report to the police / CID cybercrime unit and to ScamShield LK.",
        ],
      },
      {
        heading: "Then protect others",
        body: [
          "Reporting the number and message helps the community and feeds real examples that make detection better for everyone.",
        ],
      },
    ],
  },
  {
    slug: "safe-online-shopping-parcel-scams",
    title: "Safe online shopping: beating parcel and 'customs fee' scams",
    category: "Shopping",
    tone: "spam",
    readMins: 5,
    published: "2026-06-20",
    author: "ScamShield LK Team",
    excerpt: "As deliveries rise, so do fake courier texts. Learn the tells and how to track parcels safely.",
    tags: ["shopping", "delivery"],
    sections: [
      {
        heading: "The fake-parcel formula",
        body: ["Almost every parcel scam follows the same three beats:"],
        list: [
          "An SMS says a delivery failed or is 'held at customs'.",
          "A small fee (Rs. 50 to 300) is demanded via a link, small enough to seem harmless.",
          "The payment page quietly captures your card details.",
        ],
      },
      {
        heading: "Shop and track safely",
        body: [
          "Track parcels only in the courier's official app or website, never through a link in an SMS.",
          "Genuine customs charges are handled through official channels, not a random SMS with a countdown.",
        ],
      },
    ],
  },
];

export const ARTICLE_BY_SLUG = Object.fromEntries(ARTICLES.map((a) => [a.slug, a]));
export function getArticle(slug) {
  return ARTICLE_BY_SLUG[slug] || null;
}
