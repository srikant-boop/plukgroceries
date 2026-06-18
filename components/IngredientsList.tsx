import type { IngredientRow, IngredientSection } from "@/lib/pantry-catalog";

function formatIngredient(row: IngredientRow): string {
  return row.amount ? `${row.name} ${row.amount}` : row.name;
}

function formatAllergenNote(text: string): { text: string; emphasize: boolean } {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  if (lower.startsWith("contains")) {
    return { text: trimmed, emphasize: true };
  }

  if (lower.startsWith("does not contain")) {
    const rest = trimmed.replace(/^does not contain\s+/i, "");
    return {
      text: `Free from ${rest.charAt(0).toLowerCase()}${rest.slice(1)}`,
      emphasize: false,
    };
  }

  if (lower.startsWith("free from")) {
    return { text: trimmed, emphasize: false };
  }

  return { text: trimmed, emphasize: trimmed.toLowerCase().startsWith("contains") };
}

function SectionProse({ section }: { section: IngredientSection }) {
  const prose = section.rows.map(formatIngredient).join(", ");

  return (
    <div>
      {section.heading && (
        <p className="text-xs uppercase tracking-wide text-muted mb-1.5">
          {section.heading}
        </p>
      )}
      <p className="leading-relaxed">{prose}</p>
    </div>
  );
}

export function IngredientsList({
  sections,
  note,
  allergens,
}: {
  sections: IngredientSection[];
  note?: string;
  allergens?: string;
}) {
  const allergenNote = allergens?.trim()
    ? formatAllergenNote(allergens)
    : null;

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <SectionProse
          key={section.heading ?? `section-${index}`}
          section={section}
        />
      ))}
      {allergenNote && (
        <p
          className={
            allergenNote.emphasize
              ? "font-semibold leading-relaxed"
              : "leading-relaxed"
          }
        >
          {allergenNote.text}
        </p>
      )}
      {note?.trim() && (
        <p className="text-sm leading-relaxed text-muted border-t border-line pt-3">
          {note}
        </p>
      )}
    </div>
  );
}
