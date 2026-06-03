"use client";

import { useEffect } from "react";
import { storeInviteRef, normalizeInviteRef } from "@/lib/invite-client";

/** Persist ?ref= from the URL so checkout can attach the inviter link. */
export function InviteRefCapture() {
  useEffect(() => {
    const ref = normalizeInviteRef(
      new URLSearchParams(window.location.search).get("ref"),
    );
    if (ref) storeInviteRef(ref);
  }, []);

  return null;
}
