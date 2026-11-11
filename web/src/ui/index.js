// ScamShield LK web UI kit — single import surface for all shared primitives.
export { cn } from "./cn.js";
export {
  Button,
  IconButton,
  Badge,
  StatusDot,
  Spinner,
  Avatar,
  ProgressBar,
  Divider,
  Kbd,
  CtaArrow,
} from "./primitives.jsx";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  SectionHeading,
  Stat,
} from "./card.jsx";
export {
  Field,
  Input,
  SearchInput,
  Textarea,
  Select,
  Checkbox,
  RadioCard,
  Switch,
  SegmentedControl,
} from "./forms.jsx";
export {
  Alert,
  EmptyState,
  ErrorState,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  ToastProvider,
  useToast,
  useBodyScrollLock,
} from "./feedback.jsx";
export { Modal, ConfirmDialog, Drawer, Tooltip, DropdownMenu, DropdownItem } from "./overlays.jsx";
export { Tabs, Breadcrumbs, PageHeader, Pagination } from "./navigation.jsx";
export {
  VERDICTS,
  resolveVerdict,
  VerdictBadge,
  ConfidenceRing,
  ConfidenceBar,
} from "./verdict.jsx";
export { DataTable } from "./table.jsx";
export {
  CELL_COLORS,
  CATEGORY_PALETTE,
  niceMax,
  compact,
  PanelHeader,
  KpiStrip,
  CellBarChart,
  WaffleChart,
  CellMeter,
  CellBarRow,
  SegmentBar,
  TickGauge,
  SignalTrace,
  InsightPanel,
} from "./infographics.jsx";
