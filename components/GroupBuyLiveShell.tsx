"use client";

import { GroupBuyActivityToasts } from "@/components/GroupBuyActivityToasts";
import { GroupBuyLiveProvider } from "@/components/group-buy-live-context";

export function GroupBuyLiveShell({ children }: { children: React.ReactNode }) {
  return (
    <GroupBuyLiveProvider>
      {children}
      <GroupBuyActivityToasts />
    </GroupBuyLiveProvider>
  );
}
