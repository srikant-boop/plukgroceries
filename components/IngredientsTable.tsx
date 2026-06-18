import type { IngredientSection } from "@/lib/pantry-catalog";

function SectionTable({ section }: { section: IngredientSection }) {
  const showAmount = section.rows.some((row) => row.amount);

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
              {showAmount && (
                <th className="py-2 font-normal eyebrow w-24 text-right">
                  Amount
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row) => (
              <tr key={row.name} className="border-b border-line/60">
                <td className="py-2 pr-4 leading-snug">{row.name}</td>
                {showAmount && (
                  <td className="py-2 text-right tabular-nums text-muted whitespace-nowrap">
                    {row.amount ?? "—"}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function IngredientsTable({
  sections,
  note,
}: {
  sections: IngredientSection[];
  note?: string;
}) {
  return (
    <div className="space-y-5">
      {sections.map((section, index) => (
        <SectionTable
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
