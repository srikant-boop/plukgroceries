"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { GroupBuyProgress } from "@/lib/group-buy-config";
import {
  formatActivityHeadline,
  type GroupBuyActivityEvent,
} from "@/lib/group-buy-activity-types";

const POLL_MS = 4_000;
const SKIP_ORDER_KEY = "pluk:skip-activity-order-id";

type ToastItem = {
  key: string;
  headline: string;
  at: number;
};

type GroupBuyLiveContextValue = {
  progress: Record<string, GroupBuyProgress>;
  getProgress: (productId: string) => GroupBuyProgress | undefined;
  toasts: ToastItem[];
  dismissToast: (key: string) => void;
  bump: () => void;
};

const GroupBuyLiveContext = createContext<GroupBuyLiveContextValue | null>(
  null,
);

export function useGroupBuyLive() {
  return useContext(GroupBuyLiveContext);
}

export function useGroupBuyProgress(productId: string) {
  const live = useGroupBuyLive();
  return live?.getProgress(productId);
}

function shouldSkipEvent(event: GroupBuyActivityEvent): boolean {
  if (typeof window === "undefined") return false;
  const skipId = sessionStorage.getItem(SKIP_ORDER_KEY);
  if (!skipId) return false;
  if (event.orderId === skipId) {
    sessionStorage.removeItem(SKIP_ORDER_KEY);
    return true;
  }
  return false;
}

export function GroupBuyLiveProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Record<string, GroupBuyProgress>>(
    {},
  );
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const sinceRef = useRef<number>(Date.now() - 5_000);
  const seenEventsRef = useRef<Set<string>>(new Set());
  const bumpRef = useRef(0);

  const pushEvents = useCallback((events: GroupBuyActivityEvent[]) => {
    const fresh = events.filter((event) => {
      if (seenEventsRef.current.has(event.id)) return false;
      seenEventsRef.current.add(event.id);
      if (shouldSkipEvent(event)) return false;
      return true;
    });
    if (fresh.length === 0) return;

    setToasts((prev) => {
      const next = [...prev];
      for (const event of fresh) {
        next.push({
          key: event.id,
          headline: formatActivityHeadline(event),
          at: event.at,
        });
      }
      return next.slice(-4);
    });
  }, []);

  const poll = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/group-buy/live?since=${sinceRef.current}`,
        { cache: "no-store" },
      );
      if (!res.ok) return;
      const data = (await res.json()) as {
        progress?: Record<string, GroupBuyProgress>;
        events?: GroupBuyActivityEvent[];
        serverTime?: number;
      };
      if (data.progress) setProgress(data.progress);
      if (data.events?.length) pushEvents(data.events);
      if (typeof data.serverTime === "number") {
        sinceRef.current = data.serverTime;
      }
    } catch {
      /* ignore transient network errors */
    }
  }, [pushEvents]);

  const bump = useCallback(() => {
    bumpRef.current += 1;
    void poll();
  }, [poll]);

  useEffect(() => {
    void poll();
    const id = window.setInterval(poll, POLL_MS);
    const onFocus = () => void poll();
    const onVisible = () => {
      if (document.visibilityState === "visible") void poll();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [poll]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const id = window.setInterval(() => {
      const cutoff = Date.now() - 7_000;
      setToasts((prev) => prev.filter((t) => t.at > cutoff));
    }, 1_000);
    return () => window.clearInterval(id);
  }, [toasts.length]);

  const value = useMemo<GroupBuyLiveContextValue>(
    () => ({
      progress,
      getProgress: (productId) => progress[productId],
      toasts,
      dismissToast: (key) =>
        setToasts((prev) => prev.filter((t) => t.key !== key)),
      bump,
    }),
    [progress, toasts, bump],
  );

  return (
    <GroupBuyLiveContext.Provider value={value}>
      {children}
    </GroupBuyLiveContext.Provider>
  );
}

export function rememberSkipActivityForOrder(orderId: string | undefined) {
  if (!orderId || typeof window === "undefined") return;
  sessionStorage.setItem(SKIP_ORDER_KEY, orderId);
}
