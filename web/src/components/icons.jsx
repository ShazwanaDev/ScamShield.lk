function base(props) {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    ...props,
  };
}

export function IconShield(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 3 4.5 5.8v5.4c0 4.9 3.2 8.6 7.5 9.8 4.3-1.2 7.5-4.9 7.5-9.8V5.8L12 3Z" />
      <path d="m9 12 2.1 2.1L15.5 9.5" />
    </svg>
  );
}

export function IconAlertTriangle(props) {
  return (
    <svg {...base(props)}>
      <path d="M10.4 3.6 2.7 17.5A1.8 1.8 0 0 0 4.3 20h15.4a1.8 1.8 0 0 0 1.6-2.5L13.6 3.6a1.8 1.8 0 0 0-3.2 0Z" />
      <path d="M12 9.2v4.3" />
      <circle cx="12" cy="16.6" r="0.15" fill="currentColor" stroke="none" />
      <path d="M12 16.9v.1" />
    </svg>
  );
}

export function IconCheckCircle(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.3 12.3 2.4 2.4 4.9-5.4" />
    </svg>
  );
}

export function IconFlag(props) {
  return (
    <svg {...base(props)}>
      <path d="M5 20.5V4" />
      <path d="M5 5c1.4-1 3-1 4.4 0 1.7 1.2 3.5 1.2 5.2 0 1-.7 2-.9 3-.5v8.4c-1 .5-2 .5-3-.2-1.7-1.2-3.5-1.2-5.2 0-1.4 1-3 1-4.4 0" />
    </svg>
  );
}

export function IconClock(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.3V12l3.3 2" />
    </svg>
  );
}

export function IconWifiOff(props) {
  return (
    <svg {...base(props)}>
      <path d="M3 3l18 18" />
      <path d="M8.5 8.9a10 10 0 0 1 9.9 1.3" />
      <path d="M5.3 12.1a10 10 0 0 1 2.6-1.9" />
      <path d="M9 15.6a5 5 0 0 1 6 .1" />
      <path d="M12 19v.01" />
    </svg>
  );
}

export function IconMenu(props) {
  return (
    <svg {...base(props)}>
      <path d="M4 6.5h16M4 12h16M4 17.5h16" />
    </svg>
  );
}

export function IconClose(props) {
  return (
    <svg {...base(props)}>
      <path d="m5 5 14 14M19 5 5 19" />
    </svg>
  );
}

export function IconThumbsUp(props) {
  return (
    <svg {...base(props)}>
      <path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3Z" />
      <path d="M7 11l3.6-7.2a2 2 0 0 1 2 2.2L11.8 9H18a2 2 0 0 1 2 2.4l-1.3 6A2 2 0 0 1 16.8 19H10a3 3 0 0 1-3-3v-5Z" />
    </svg>
  );
}

export function IconThumbsDown(props) {
  return (
    <svg {...base(props)}>
      <path d="M17 13V4h3a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-3Z" />
      <path d="M17 13l-3.6 7.2a2 2 0 0 1-2-2.2l0.8-4H6a2 2 0 0 1-2-2.4l1.3-6A2 2 0 0 1 7.2 4H14a3 3 0 0 1 3 3v6Z" />
    </svg>
  );
}

export function IconChevronRight(props) {
  return (
    <svg {...base(props)}>
      <path d="m9 5.5 6.5 6.5L9 18.5" />
    </svg>
  );
}

export function IconLock(props) {
  return (
    <svg {...base(props)}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
    </svg>
  );
}

export function IconInfo(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.3" />
      <path d="M12 7.7v.01" />
    </svg>
  );
}

export function IconSearch(props) {
  return (
    <svg {...base(props)}>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m19.5 19.5-4-4" />
    </svg>
  );
}

export function IconUser(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8.2" r="3.7" />
      <path d="M4.8 20c1.3-3.6 4.3-5.5 7.2-5.5s5.9 1.9 7.2 5.5" />
    </svg>
  );
}

export function IconHistory(props) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
      <path d="M3.5 4.5v4.4h4.4" />
      <path d="M12 8v4.3l3 2" />
    </svg>
  );
}

export function IconLogout(props) {
  return (
    <svg {...base(props)}>
      <path d="M9 20H5.8A1.8 1.8 0 0 1 4 18.2V5.8A1.8 1.8 0 0 1 5.8 4H9" />
      <path d="M15.5 16.5 20 12l-4.5-4.5" />
      <path d="M20 12H9" />
    </svg>
  );
}

export function IconChartBar(props) {
  return (
    <svg {...base(props)}>
      <path d="M4 20V10" />
      <path d="M12 20V4" />
      <path d="M20 20v-7" />
      <path d="M4 20h16" />
    </svg>
  );
}

export function IconTrash(props) {
  return (
    <svg {...base(props)}>
      <path d="M5 7h14" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M7 7l1 12.5a1.5 1.5 0 0 0 1.5 1.5h5a1.5 1.5 0 0 0 1.5-1.5L17 7" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function IconArrowRight(props) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 12h15" />
      <path d="m13.5 5.5 6.5 6.5-6.5 6.5" />
    </svg>
  );
}

export function IconMail(props) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

export function IconSparkle(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5 13.7 9l5.3 1.7-5.3 1.7L12 18l-1.7-5.6L5 10.7 10.3 9 12 3.5Z" />
    </svg>
  );
}

export function IconGithub(props) {
  return (
    <svg {...base(props)}>
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.4c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.2a11.6 11.6 0 0 0-6.2 0C6.6 2.8 5.6 3.1 5.6 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.2 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.1-.5 2V21" />
    </svg>
  );
}

export function IconDatabase(props) {
  return (
    <svg {...base(props)}>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" />
      <path d="M4.5 12v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
    </svg>
  );
}

export function IconChevronDown(props) {
  return (
    <svg {...base(props)}>
      <path d="m5.5 8.5 6.5 6.5 6.5-6.5" />
    </svg>
  );
}

export function IconClipboard(props) {
  return (
    <svg {...base(props)}>
      <rect x="5.5" y="5" width="13" height="16" rx="2" />
      <path d="M9 5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 11h6M9 15h6" />
    </svg>
  );
}

export function IconCpu(props) {
  return (
    <svg {...base(props)}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2 2M17.5 17.5l2 2M19.5 4.5l-2 2M6.5 17.5l-2 2" />
    </svg>
  );
}

export function IconGlobe(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.4 2.3 3.7 5.2 3.7 8.5s-1.3 6.2-3.7 8.5c-2.4-2.3-3.7-5.2-3.7-8.5s1.3-6.2 3.7-8.5Z" />
    </svg>
  );
}

/* ── Extended set for the three portals ─────────────────────────── */

export function IconEye(props) {
  return (
    <svg {...base(props)}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
export function IconEyeOff(props) {
  return (
    <svg {...base(props)}>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.1A9.7 9.7 0 0 1 12 6c6 0 9.5 6 9.5 6a15 15 0 0 1-3 3.6" />
      <path d="M6.6 6.7A15 15 0 0 0 2.5 12S6 18 12 18a9.4 9.4 0 0 0 3.4-.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}
export function IconUpload(props) {
  return (
    <svg {...base(props)}>
      <path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" />
      <path d="M12 15V4" />
      <path d="m7.5 8 4.5-4.5L16.5 8" />
    </svg>
  );
}
export function IconDownload(props) {
  return (
    <svg {...base(props)}>
      <path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" />
      <path d="M12 4v11" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
    </svg>
  );
}
export function IconImage(props) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m4 17 4.5-4.5 3.5 3.5 3-3 5 5" />
    </svg>
  );
}
export function IconFilter(props) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 5.5h17l-6.5 8v5l-4 2v-7l-6.5-8Z" />
    </svg>
  );
}
export function IconSort(props) {
  return (
    <svg {...base(props)}>
      <path d="M7 4v16M7 4 3.5 7.5M7 4l3.5 3.5" />
      <path d="M17 20V4M17 20l3.5-3.5M17 20l-3.5-3.5" />
    </svg>
  );
}
export function IconPlus(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
export function IconMinus(props) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14" />
    </svg>
  );
}
export function IconEdit(props) {
  return (
    <svg {...base(props)}>
      <path d="M4 20h4L18.5 9.5a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L4 16v4Z" />
      <path d="M13.5 6.5l4 4" />
    </svg>
  );
}
export function IconCheck(props) {
  return (
    <svg {...base(props)}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}
export function IconChevronLeft(props) {
  return (
    <svg {...base(props)}>
      <path d="m15 5.5-6.5 6.5L15 18.5" />
    </svg>
  );
}
export function IconChevronUp(props) {
  return (
    <svg {...base(props)}>
      <path d="m5.5 15.5 6.5-6.5 6.5 6.5" />
    </svg>
  );
}
export function IconArrowLeft(props) {
  return (
    <svg {...base(props)}>
      <path d="M19.5 12h-15" />
      <path d="m10.5 5.5-6.5 6.5 6.5 6.5" />
    </svg>
  );
}
export function IconExternalLink(props) {
  return (
    <svg {...base(props)}>
      <path d="M14 5h5v5" />
      <path d="M19 5l-8 8" />
      <path d="M18 13.5V18a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 18V7.5A1.5 1.5 0 0 1 6.5 6H11" />
    </svg>
  );
}
export function IconBell(props) {
  return (
    <svg {...base(props)}>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}
export function IconBellRing(props) {
  return (
    <svg {...base(props)}>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
      <path d="M21 6a4 4 0 0 0-1.2-2.8M3 6a4 4 0 0 1 1.2-2.8" />
    </svg>
  );
}
export function IconSettings(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
    </svg>
  );
}
export function IconHome(props) {
  return (
    <svg {...base(props)}>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 9.5V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}
export function IconUsers(props) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c1-3 3.2-4.6 5.5-4.6s4.5 1.6 5.5 4.6" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 5.9" />
      <path d="M17.5 14.6c1.8.5 3.2 2 4 4.4" />
    </svg>
  );
}
export function IconFileText(props) {
  return (
    <svg {...base(props)}>
      <path d="M6 3h7l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M13 3v5h5" />
      <path d="M8.5 13h7M8.5 16.5h7M8.5 9.5h2" />
    </svg>
  );
}
export function IconFolder(props) {
  return (
    <svg {...base(props)}>
      <path d="M4 6.5A1.5 1.5 0 0 1 5.5 5H10l2 2.5h6.5A1.5 1.5 0 0 1 20 9v8.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5V6.5Z" />
    </svg>
  );
}
export function IconLayers(props) {
  return (
    <svg {...base(props)}>
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
      <path d="m3.5 12 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
    </svg>
  );
}
export function IconActivity(props) {
  return (
    <svg {...base(props)}>
      <path d="M3 12h4l2.5 7 5-14 2.5 7H21" />
    </svg>
  );
}
export function IconBookOpen(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 6.5C10.5 5 8 4.5 4 4.8v13c4-.3 6.5.2 8 1.7 1.5-1.5 4-2 8-1.7v-13c-4-.3-6.5.2-8 1.7Z" />
      <path d="M12 6.5V20" />
    </svg>
  );
}
export function IconBookmark(props) {
  return (
    <svg {...base(props)}>
      <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4V4.5Z" />
    </svg>
  );
}
export function IconMessageSquare(props) {
  return (
    <svg {...base(props)}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-5 4V5.5Z" />
    </svg>
  );
}
export function IconMegaphone(props) {
  return (
    <svg {...base(props)}>
      <path d="M4 10v4a1 1 0 0 0 1 1h2l6 4V5L7 9H5a1 1 0 0 0-1 1Z" />
      <path d="M17 8.5a4 4 0 0 1 0 7" />
    </svg>
  );
}
export function IconShieldCheck(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 3 4.5 5.8v5.4c0 4.9 3.2 8.6 7.5 9.8 4.3-1.2 7.5-4.9 7.5-9.8V5.8L12 3Z" />
      <path d="m9 12 2.1 2.1L15.5 9.5" />
    </svg>
  );
}
export function IconShieldAlert(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 3 4.5 5.8v5.4c0 4.9 3.2 8.6 7.5 9.8 4.3-1.2 7.5-4.9 7.5-9.8V5.8L12 3Z" />
      <path d="M12 8.5v4M12 15.5v.01" />
    </svg>
  );
}
export function IconHelpCircle(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 4.8.8c0 1.7-2.3 2.2-2.3 3.7" />
      <path d="M12 17v.01" />
    </svg>
  );
}
export function IconLifeBuoy(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="m5 5 4.5 4.5M14.5 14.5 19 19M19 5l-4.5 4.5M9.5 14.5 5 19" />
    </svg>
  );
}
export function IconMoreVertical(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="5.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="18.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function IconCalendar(props) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="5.5" width="16" height="15" rx="2" />
      <path d="M4 9.5h16M8 3.5v4M16 3.5v4" />
    </svg>
  );
}
export function IconPhone(props) {
  return (
    <svg {...base(props)}>
      <path d="M6 3.5h3l1.5 4.5-2 1.4a11 11 0 0 0 4.6 4.6l1.4-2 4.5 1.5v3a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 4.5 5.1 1.5 1.5 0 0 1 6 3.5Z" />
    </svg>
  );
}
export function IconCreditCard(props) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3 9.5h18M6.5 14.5h4" />
    </svg>
  );
}
export function IconTag(props) {
  return (
    <svg {...base(props)}>
      <path d="M4 4h7l9 9-7 7-9-9V4Z" />
      <circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function IconTrendingUp(props) {
  return (
    <svg {...base(props)}>
      <path d="M3 17 9.5 10.5l3.5 3.5L21 6" />
      <path d="M15 6h6v6" />
    </svg>
  );
}
export function IconTrendingDown(props) {
  return (
    <svg {...base(props)}>
      <path d="M3 7 9.5 13.5l3.5-3.5L21 18" />
      <path d="M15 18h6v-6" />
    </svg>
  );
}
export function IconPieChart(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v9h9a9 9 0 1 0-9-9Z" opacity="0.4" />
      <path d="M21 12a9 9 0 1 1-9-9v9h9Z" />
    </svg>
  );
}
export function IconTarget(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function IconZap(props) {
  return (
    <svg {...base(props)}>
      <path d="M13 2 4.5 13.5H11l-1 8.5L19 10.5h-6.5L13 2Z" />
    </svg>
  );
}
export function IconServer(props) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="4" width="17" height="7" rx="1.5" />
      <rect x="3.5" y="13" width="17" height="7" rx="1.5" />
      <path d="M7 7.5v.01M7 16.5v.01" />
    </svg>
  );
}
export function IconGitBranch(props) {
  return (
    <svg {...base(props)}>
      <circle cx="7" cy="6" r="2.2" />
      <circle cx="7" cy="18" r="2.2" />
      <circle cx="17" cy="8" r="2.2" />
      <path d="M7 8.2v7.6M9.2 7.2A6 6 0 0 1 15 10c0 3-2 4-5 4.5" />
    </svg>
  );
}
export function IconPlay(props) {
  return (
    <svg {...base(props)}>
      <path d="M7 5.5 18 12 7 18.5v-13Z" />
    </svg>
  );
}
export function IconRefresh(props) {
  return (
    <svg {...base(props)}>
      <path d="M20 8a8 8 0 0 0-14-2.5L4 8" />
      <path d="M4 4v4h4" />
      <path d="M4 16a8 8 0 0 0 14 2.5L20 16" />
      <path d="M20 20v-4h-4" />
    </svg>
  );
}
export function IconRotateBack(props) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 9A8 8 0 1 1 4 12" />
      <path d="M4 4.5V9h4.5" />
    </svg>
  );
}
export function IconSliders(props) {
  return (
    <svg {...base(props)}>
      <path d="M4 8h9M17 8h3M4 16h3M11 16h9" />
      <circle cx="15" cy="8" r="2" />
      <circle cx="9" cy="16" r="2" />
    </svg>
  );
}
export function IconKey(props) {
  return (
    <svg {...base(props)}>
      <circle cx="8" cy="8" r="4" />
      <path d="m11 11 8 8M16 16l2-2M18.5 18.5l1.5-1.5" />
    </svg>
  );
}
export function IconStar(props) {
  return (
    <svg {...base(props)}>
      <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9-4.3-4.1 5.9-.8L12 3.5Z" />
    </svg>
  );
}
export function IconGrid(props) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}
export function IconList(props) {
  return (
    <svg {...base(props)}>
      <path d="M8 6h12M8 12h12M8 18h12" />
      <path d="M4 6v.01M4 12v.01M4 18v.01" />
    </svg>
  );
}
export function IconAlertCircle(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5M12 16v.01" />
    </svg>
  );
}
export function IconLoader(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v3M12 18v3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M3 12h3M18 12h3M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </svg>
  );
}
export function IconLanguages(props) {
  return (
    <svg {...base(props)}>
      <path d="M3 6h8M7 4v2c0 3.5-2 6-4 7" />
      <path d="M5 10c1.5 2.5 3.5 3.8 5 4.5" />
      <path d="m12.5 20 3.5-8 3.5 8M13.7 17h4.6" />
    </svg>
  );
}
export function IconSmartphone(props) {
  return (
    <svg {...base(props)}>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M11 17.5h2" />
    </svg>
  );
}
export function IconSend(props) {
  return (
    <svg {...base(props)}>
      <path d="M20.5 3.5 10 14" />
      <path d="M20.5 3.5 14 20.5l-4-8-8-4 18.5-5Z" />
    </svg>
  );
}
export function IconCopy(props) {
  return (
    <svg {...base(props)}>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8" />
    </svg>
  );
}
export function IconBrain(props) {
  return (
    <svg {...base(props)}>
      <path d="M9.5 4a2.5 2.5 0 0 0-2.5 2.5A2.5 2.5 0 0 0 4.5 9c0 1 .4 1.7 1 2.3-.6.6-1 1.4-1 2.4A2.5 2.5 0 0 0 7 16a2.5 2.5 0 0 0 2.5 2.5c.9 0 1.5-.4 2-1V5c-.5-.6-1.1-1-2-1Z" />
      <path d="M14.5 4A2.5 2.5 0 0 1 17 6.5 2.5 2.5 0 0 1 19.5 9c0 1-.4 1.7-1 2.3.6.6 1 1.4 1 2.4A2.5 2.5 0 0 1 17 16a2.5 2.5 0 0 1-2.5 2.5c-.9 0-1.5-.4-2-1V5c.5-.6 1.1-1 2-1Z" />
    </svg>
  );
}
export function IconWand(props) {
  return (
    <svg {...base(props)}>
      <path d="m4 20 10-10" />
      <path d="M13 4.5 14 7l2.5 1-2.5 1-1 2.5-1-2.5L9.5 8 12 7l1-2.5Z" />
      <path d="M18.5 12.5 19 14l1.5.5-1.5.5-.5 1.5-.5-1.5L16 14.5l1.5-.5.5-1.5Z" />
    </svg>
  );
}
export function IconInbox(props) {
  return (
    <svg {...base(props)}>
      <path d="M4 13.5 6.5 6a1.5 1.5 0 0 1 1.4-1h8.2A1.5 1.5 0 0 1 17.5 6L20 13.5V18a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18v-4.5Z" />
      <path d="M4 13.5h4a2 2 0 0 0 4 0 2 2 0 0 0 4 0h4" />
    </svg>
  );
}
export function IconGauge(props) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 16a8 8 0 1 1 15 0" />
      <path d="M12 16l4-5" />
      <circle cx="12" cy="16" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function IconScale(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 4v16M7 20h10" />
      <path d="M6 7h12M6 7 3.5 13a3 3 0 0 0 5 0L6 7ZM18 7l-2.5 6a3 3 0 0 0 5 0L18 7Z" />
    </svg>
  );
}
export function IconCheckSquare(props) {
  return (
    <svg {...base(props)}>
      <path d="M9 11.5 11.5 14 16 9" />
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
    </svg>
  );
}
export function IconLogIn(props) {
  return (
    <svg {...base(props)}>
      <path d="M14 4h3.2A1.8 1.8 0 0 1 19 5.8v12.4a1.8 1.8 0 0 1-1.8 1.8H14" />
      <path d="M9.5 8 13.5 12l-4 4M13.5 12H4" />
    </svg>
  );
}
export function IconSun(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
    </svg>
  );
}
export function IconMapPin(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 21c4-4.5 6.5-7.8 6.5-11a6.5 6.5 0 1 0-13 0c0 3.2 2.5 6.5 6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}
