import type { IngredientRow, IngredientSection } from "@/lib/pantry-catalog";

function formatIngredient(row: IngredientRow): string {
  return row.amount ? `${row.name} ${row.amount}` : row.name;
}

function sectionUsesTable(section: IngredientSection): boolean {
  return (
    section.rows.length > 0 &&
    section.rows.every((row) => Boolean(row.amount))
  );
}

function SectionTable({ section }: { section: IngredientSection }) {
  return (
    <div>
      {section.heading && (
        <p className="text-xs uppercase tracking-wide text-muted mb-2">
          {section.heading}
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[240px] text-sm border-collapse">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-2 pr-4 font-normal eyebrow">Ingredient</th>
              <th className="py-2 font-normal eyebrow w-24 text-right">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row) => (
              <tr key={row.name} className="border-b border-line/60">
                <td className="py-2 pr-4 leading-snug">{row.name}</td>
                <td className="py-2 text-right tabular-nums text-muted whitespace-nowrap">
                  {row.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
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

function SectionBlock({ section }: { section: IngredientSection }) {
  return sectionUsesTable(section) ? (
    <SectionTable section={section} />
  ) : (
    <SectionProse section={section} />
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
        <SectionBlock
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
