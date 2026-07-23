import {
  IconHome,
  IconShieldCheck,
  IconHistory,
  IconFlag,
  IconMegaphone,
  IconBookOpen,
  IconBell,
  IconUser,
  IconSettings,
  IconChartBar,
  IconInbox,
  IconDatabase,
  IconCheckSquare,
  IconCpu,
  IconTarget,
  IconWand,
  IconUsers,
  IconLifeBuoy,
  IconServer,
  IconSliders,
  IconTag,
} from "../icons.jsx";

/** User portal (authenticated) navigation. */
export const APP_NAV = [
  {
    items: [
      { to: "/app", label: "Dashboard", icon: IconHome, end: true },
      { to: "/app/check", label: "Check a message", icon: IconShieldCheck },
      { to: "/app/history", label: "History", icon: IconHistory },
    ],
  },
  {
    label: "Community",
    items: [
      { to: "/app/reports", label: "My reports", icon: IconFlag },
      { to: "/app/alerts", label: "Community alerts", icon: IconMegaphone },
      { to: "/app/awareness", label: "Awareness hub", icon: IconBookOpen },
    ],
  },
  {
    label: "Account",
    items: [
      { to: "/app/notifications", label: "Notifications", icon: IconBell },
      { to: "/app/profile", label: "Profile", icon: IconUser },
      { to: "/app/settings", label: "Settings", icon: IconSettings },
    ],
  },
];

/** Admin portal navigation (grouped). */
export const ADMIN_NAV = [
  {
    items: [
      { to: "/admin", label: "Dashboard", icon: IconHome, end: true },
      { to: "/admin/analytics", label: "Analytics", icon: IconChartBar },
    ],
  },
  {
    label: "Moderation",
    items: [
      { to: "/admin/moderation", label: "Moderation queue", icon: IconInbox },
      { to: "/admin/reports", label: "Scam reports", icon: IconFlag },
      { to: "/admin/feedback", label: "Prediction feedback", icon: IconCheckSquare },
    ],
  },
  {
    label: "Data & ML",
    items: [
      { to: "/admin/dataset", label: "Dataset", icon: IconDatabase },
      { to: "/admin/annotation", label: "Annotation", icon: IconTag },
      { to: "/admin/models", label: "Models", icon: IconCpu },
      { to: "/admin/evaluation", label: "Evaluation", icon: IconTarget },
      { to: "/admin/explainability", label: "Explainability", icon: IconWand },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/categories", label: "Scam categories", icon: IconTag },
      { to: "/admin/alerts", label: "Community alerts", icon: IconMegaphone },
      { to: "/admin/articles", label: "Awareness articles", icon: IconBookOpen },
      { to: "/admin/quiz", label: "Quiz", icon: IconCheckSquare },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/admin/users", label: "Users", icon: IconUsers },
      { to: "/admin/support", label: "Support tickets", icon: IconLifeBuoy },
      { to: "/admin/system", label: "System health", icon: IconServer },
      { to: "/admin/settings", label: "Settings", icon: IconSliders },
    ],
  },
];
