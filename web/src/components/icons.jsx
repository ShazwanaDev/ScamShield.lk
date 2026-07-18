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
