import { useEffect } from "react";
import { useToast } from "../ui/index.js";
import { flushReportQueue, queuedReportCount } from "../lib/reportQueue.js";

/**
 * Sends reports that were saved while offline: once when the app starts, and again whenever the
 * browser reports that the connection is back. Renders nothing.
 */
export default function ReportQueueSync() {
  const { toast } = useToast();

  useEffect(() => {
    const flush = async () => {
      if (!queuedReportCount()) return;
      const { sent } = await flushReportQueue();
      if (sent > 0) {
        toast({
          tone: "success",
          title: sent === 1 ? "Saved report sent" : `${sent} saved reports sent`,
          description: "A moderator will review it before it counts toward public stats.",
        });
      }
    };
    flush();
    window.addEventListener("online", flush);
    return () => window.removeEventListener("online", flush);
  }, [toast]);

  return null;
}
