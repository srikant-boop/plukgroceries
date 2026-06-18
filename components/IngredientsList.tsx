import type { IngredientRow, IngredientSection } from "@/lib/pantry-catalog";

function formatIngredient(row: IngredientRow): string {
  return row.amount ? `${row.name} ${row.amount}` : row.name;
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
}: {
  sections: IngredientSection[];
  note?: string;
}) {
  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <SectionProse
          key={section.heading ?? `section-${index}`}
          section={section}
        />
      ))}
      {note && (
        <p className="text-sm leading-relaxed text-muted border-t border-line pt-3">
          {note}
        </p>
      )}
    </div>
  );
}
