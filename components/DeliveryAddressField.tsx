"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { AddressSuggestion } from "@/lib/address-search";

type Props = {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

export function DeliveryAddressField({ value, onChange, required }: Props) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const q = value.trim();
    if (q.length < 3) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/address-search?q=${encodeURIComponent(q)}`,
        );
        const data = (await res.json()) as AddressSuggestion[];
        setSuggestions(data);
        setOpen(data.length > 0);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => window.clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const pick = (label: string) => {
    onChange(label);
    setOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);
  };

  return (
    <div ref={rootRef} className="relative">
      <label className="block" htmlFor={`${listId}-input`}>
        <span className="block text-xs text-muted mb-1.5">
          Delivery address
          {required && " *"}
        </span>
        <input
          id={`${listId}-input`}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          onKeyDown={(e) => {
            if (!open || suggestions.length === 0) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((i) => (i + 1) % suggestions.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((i) =>
                i <= 0 ? suggestions.length - 1 : i - 1,
              );
            } else if (e.key === "Enter" && activeIndex >= 0) {
              e.preventDefault();
              pick(suggestions[activeIndex].label);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          required={required}
          autoComplete="shipping street-address"
          name="shipping-address-line1"
          placeholder="Start typing your Oakville address…"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${listId}-listbox`}
          aria-autocomplete="list"
          className="w-full border border-line bg-surface p-3 text-sm focus:outline-none focus:border-foreground"
        />
      </label>

      {loading && (
        <p className="mt-1 text-[11px] text-muted">Searching addresses…</p>
      )}

      {open && suggestions.length > 0 && (
        <ul
          id={`${listId}-listbox`}
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto border border-line bg-surface shadow-sm"
        >
          {suggestions.map((item, index) => (
            <li key={item.id} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                className={`block w-full px-3 py-2.5 text-left text-sm leading-snug hover:bg-background ${
                  index === activeIndex ? "bg-background" : ""
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(item.label)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
