// Static awareness/alerts/quiz content for the mobile app — mirrors the web
// app's fixtures (web/src/data/*) so both clients teach the same material.
// Educational content; all contact details / links are safe placeholders.
// This is genuinely static content (not faked API data), so it lives in-app.

class ScamAlert {
  final String id;
  final String title;
  final String severity; // high | medium | low
  final String status; // active | monitoring | resolved
  final String region;
  final String date;
  final int reports;
  final String summary;
  final List<String> details;
  final String example;
  final List<String> advice;

  const ScamAlert({
    required this.id,
    required this.title,
    required this.severity,
    required this.status,
    required this.region,
    required this.date,
    required this.reports,
    required this.summary,
    required this.details,
    required this.example,
    required this.advice,
  });
}

const List<ScamAlert> kAlerts = [
  ScamAlert(
    id: 'AL-2041',
    title: "Fake 'anniversary draw' reload scam spreading",
    severity: 'high',
    status: 'active',
    region: 'Nationwide',
    date: '2026-07-21',
    reports: 128,
    summary:
        'SMS claiming a Rs. 2,000,000 anniversary prize asks recipients to send reload codes to claim. No such promotion exists.',
    details: [
      'The message impersonates a telecom anniversary draw and congratulates you on winning a large cash prize.',
      "Victims are told to send a Rs. 5,000 reload and reply with their NIC to 'release' the prize.",
      'Once the reload is sent, the number stops responding. No prize is ever paid.',
    ],
    example:
        'Congratulations! Your number won Rs. 2,000,000 in the Anniversary Draw. Send a Rs. 5,000 reload to [PHONE REDACTED] and reply with NIC.',
    advice: [
      'Legitimate prizes never require an upfront payment.',
      'Never send reload codes or your NIC to unknown numbers.',
    ],
  ),
  ScamAlert(
    id: 'AL-2039',
    title: "Bank 'KYC will be frozen today' phishing links",
    severity: 'high',
    status: 'active',
    region: 'Nationwide',
    date: '2026-07-20',
    reports: 96,
    summary:
        'Messages impersonating banks warn that KYC is incomplete and the account will be frozen, linking to fake login pages.',
    details: [
      "The SMS uses urgency ('frozen today') and links to a page mimicking a bank login.",
      'Entering credentials or an OTP on the fake page gives scammers account access.',
    ],
    example:
        'Dear Customer, your account KYC is incomplete and will be frozen today. Update now: hxxps://example.invalid/kyc-verify',
    advice: [
      'Banks never send login/KYC links by SMS.',
      'Only use the official banking app; type addresses yourself.',
    ],
  ),
  ScamAlert(
    id: 'AL-2036',
    title: "Parcel 'customs clearance fee' texts",
    severity: 'medium',
    status: 'active',
    region: 'Western Province',
    date: '2026-07-18',
    reports: 61,
    summary: 'Fake courier SMS ask for a small clearance fee via a link that captures card details.',
    details: [
      'Recipients are told a parcel is held at customs and a Rs. 250 fee must be paid within 24 hours.',
      'The linked payment page harvests full card details.',
    ],
    example: 'Your parcel is held at customs. Pay the Rs. 250 clearance fee within 24h to release: hxxps://example.invalid/parcel',
    advice: [
      'Track parcels only via the official courier app.',
      'Never pay a fee requested through an SMS link.',
    ],
  ),
  ScamAlert(
    id: 'AL-2030',
    title: "Fake CID 'case filed against your NIC' calls",
    severity: 'high',
    status: 'monitoring',
    region: 'Nationwide',
    date: '2026-07-14',
    reports: 44,
    summary: 'Callers impersonating CID claim a case is filed and demand an urgent fine to avoid arrest.',
    details: [
      'The caller accuses you of an offence linked to your NIC and threatens immediate arrest.',
      'You are pressured to transfer a fine secretly and urgently.',
    ],
    example: 'This is CID. A case is filed against your NIC. Pay Rs. 25,000 fine to [ACCOUNT REDACTED] within 2 hours to avoid arrest.',
    advice: [
      'Authorities never collect fines by phone or SMS.',
      "Hang up and call the institution's official number.",
    ],
  ),
];

class Article {
  final String slug;
  final String title;
  final String category;
  final int readMins;
  final String excerpt;
  final List<ArticleSection> sections;

  const Article({
    required this.slug,
    required this.title,
    required this.category,
    required this.readMins,
    required this.excerpt,
    required this.sections,
  });
}

class ArticleSection {
  final String heading;
  final List<String> body;
  final List<String> bullets;
  const ArticleSection({required this.heading, this.body = const [], this.bullets = const []});
}

const List<Article> kArticles = [
  Article(
    slug: 'spot-a-scam-sms',
    title: 'How to spot a scam SMS in 10 seconds',
    category: 'Basics',
    readMins: 4,
    excerpt: 'Four quick checks — urgency, unexpected rewards, requests for codes or money, and unofficial links.',
    sections: [
      ArticleSection(
        heading: 'The 10-second checklist',
        body: ['Most scam SMS share the same DNA. Before you tap anything, run these four checks:'],
        bullets: [
          "Urgency — 'act within 2 hours', 'account will be blocked today'.",
          'Unexpected reward or problem — a prize you never entered, or a parcel you never ordered.',
          'A request for a code, PIN, password, NIC, or money.',
          "A link or number that isn't your provider's official one.",
        ],
      ),
      ArticleSection(
        heading: 'If two or more match',
        body: [
          "Treat the message as a scam until proven otherwise. Don't click, don't call the number in the message, and don't reply.",
          'Instead, contact the organisation using a number you already trust.',
        ],
      ),
    ],
  ),
  Article(
    slug: 'never-share-otp',
    title: 'Why you should never share your OTP',
    category: 'Banking',
    readMins: 5,
    excerpt: 'An OTP is the key to your account. Genuine banks and telecoms never ask you to read one out.',
    sections: [
      ArticleSection(
        heading: 'What an OTP actually does',
        body: [
          'A one-time password authorises a specific action — a login, a transfer, a card registration.',
          "That's why sharing it is exactly like handing over the transaction itself.",
        ],
      ),
      ArticleSection(
        heading: 'Shut it down',
        body: [
          'No legitimate institution will ever ask for an OTP, PIN, CVV, or password by phone or SMS.',
          "Call your bank's official hotline and report the attempt.",
        ],
      ),
    ],
  ),
  Article(
    slug: 'code-mixed-scams',
    title: "Scams don't stick to one language",
    category: 'Multilingual',
    readMins: 5,
    excerpt: 'Sri Lankan scam texts mix Sinhala, Tamil, English and romanised Singlish. Filters built only for English miss most.',
    sections: [
      ArticleSection(
        heading: 'Why language matters',
        body: [
          "A message like 'Free 10GB, dan-ma activate karanna' blends English and romanised Sinhala.",
          'ScamShield LK is built for exactly this — Sinhala, Tamil, English, Singlish and code-mixed text.',
        ],
      ),
      ArticleSection(
        heading: 'Watch for the same tactics',
        bullets: [
          "Urgency and threats ('ikmanata', 'immediately', 'உடனடியாக').",
          "Free offers and prizes ('නොමිලේ', 'free', 'இலவசம்').",
          'Requests for codes, NIC, or reloads in any language.',
        ],
      ),
    ],
  ),
  Article(
    slug: 'helping-elders',
    title: 'Helping parents and elders avoid SMS scams',
    category: 'Family safety',
    readMins: 6,
    excerpt: 'Older relatives are frequent targets. A shared "pause and check" rule protects the whole family.',
    sections: [
      ArticleSection(
        heading: 'Agree on a family rule',
        body: [
          "The single most effective defence is a 'pause and check' rule: any message about money, prizes, or account problems gets shown to a trusted family member first.",
        ],
      ),
      ArticleSection(
        heading: 'Normalise reporting',
        body: [
          'Reassure them that nearly falling for a scam is nothing to be ashamed of. The goal is to check early and report.',
        ],
      ),
    ],
  ),
];

class QuizQuestion {
  final String text;
  final String lang; // en | si | ta | mixed
  final String answer; // scam | spam | legitimate
  final String explanation;
  const QuizQuestion({required this.text, required this.lang, required this.answer, required this.explanation});
}

const List<QuizQuestion> kQuiz = [
  QuizQuestion(
    text: 'Your account will be suspended. Share the 6-digit OTP sent to your phone to verify. Call [PHONE REDACTED] now.',
    lang: 'en',
    answer: 'scam',
    explanation: 'No genuine bank or telecom ever asks you to share an OTP. Urgency + OTP request = scam.',
  ),
  QuizQuestion(
    text: 'Your a/c XXXX1234 is debited Rs. 4,500.00 at KEELLS SUPER. Avl bal Rs. 32,105.20. Not you? Call the number on your card.',
    lang: 'en',
    answer: 'legitimate',
    explanation: 'A normal transaction alert: it states an amount and balance, and points you to the number on your card.',
  ),
  QuizQuestion(
    text: 'සුභ පැතුම්! ඔබ රු. 2,000,000ක් දිනා ඇත. ත්‍යාගය ලබා ගැනීමට රු. 5,000ක reload එකක් එවන්න.',
    lang: 'si',
    answer: 'scam',
    explanation: "A prize you never entered, plus an upfront reload to 'claim' it — a classic lottery scam.",
  ),
  QuizQuestion(
    text: 'FREE 10GB data! Dial *123*99# eka dapan activate karanna. Limited time offer!',
    lang: 'mixed',
    answer: 'spam',
    explanation: "Unsolicited promo bait. Dialling the code can activate a paid service — treat as spam, don't engage.",
  ),
  QuizQuestion(
    text: '123456 is your verification code. For your security, do not share this code with anyone, including bank staff.',
    lang: 'en',
    answer: 'legitimate',
    explanation: 'A genuine OTP message tells YOU the code and warns you not to share it — it never asks you to send it back.',
  ),
];

class AppNotification {
  final String type; // alert | report | feedback | awareness | system
  final String title;
  final String body;
  final String time;
  final bool read;
  const AppNotification({required this.type, required this.title, required this.body, required this.time, this.read = false});
}

const List<AppNotification> kNotifications = [
  AppNotification(type: 'alert', title: 'New high-severity alert', body: "Fake 'anniversary draw' reload scam is spreading nationwide.", time: '2h ago'),
  AppNotification(type: 'report', title: 'Your report was approved', body: 'Report SR-5820 was reviewed and added to community stats.', time: '1d ago'),
  AppNotification(type: 'awareness', title: 'New awareness article', body: "Read: 'How to spot a scam SMS in 10 seconds'.", time: '3d ago', read: true),
  AppNotification(type: 'system', title: 'Offline model updated', body: 'Your on-device check model was refreshed for better accuracy.', time: '5d ago', read: true),
];
