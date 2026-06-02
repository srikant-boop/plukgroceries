"use client";

import { useEffect, useRef } from "react";

const SESSION_KEY = "pluk_sid";

/** Tell the server this browser session is admin-owned (excluded from metrics). */
export function AdminRegisterSession() {
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) return;
    done.current = true;
    fetch("/api/admin/register-session", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    }).catch(() => {});
  }, []);

  return null;
}
