import type { NutritionFacts } from "@/lib/product-label-data";

const COLUMN_LABELS: Record<string, string> = {
  per100g: "Per 100 g",
  perServe: "Per serve",
  rda: "% RDA",
};

export function NutritionFactsTable({
  facts,
  summary,
}: {
  facts: NutritionFacts;
  summary?: string;
}) {
  const perServeLabel =
    facts.perServeColumnLabel ?? COLUMN_LABELS.perServe;

  return (
    <div className="space-y-4">
      <div className="text-sm space-y-1">
        <p>
          <span className="text-muted">Serving size:</span> {facts.servingSize}
        </p>
        {facts.servingsPerPack && (
          <p>
            <span className="text-muted">Servings per pack:</span>{" "}
            {facts.servingsPerPack}
          </p>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[280px] text-sm border-collapse">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-2 pr-4 font-normal eyebrow">Nutrient</th>
              {facts.columns.map((col) => (
                <th
                  key={col}
                  className="py-2 px-2 font-normal eyebrow text-right whitespace-nowrap"
                >
                  {col === "perServe" ? perServeLabel : COLUMN_LABELS[col]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {facts.rows.map((row) =>
              row.isSection ? (
                <tr key={row.nutrient} className="border-b border-line/60">
                  <td
                    colSpan={facts.columns.length + 1}
                    className="py-2 pr-4 text-xs uppercase tracking-wide text-muted"
                  >
                    {row.nutrient}
                  </td>
                </tr>
              ) : (
                <tr key={row.nutrient} className="border-b border-line/60">
                  <td className="py-2 pr-4 leading-snug">{row.nutrient}</td>
                  {facts.columns.map((col) => (
                    <td
                      key={col}
                      className="py-2 px-2 text-right tabular-nums text-muted whitespace-nowrap"
                    >
                      {row[col] ?? ""}
                    </td>
                  ))}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
      {facts.footnotes?.map((note) => (
        <p key={note} className="text-xs text-muted leading-relaxed">
          {note}
        </p>
      ))}
      {summary && (
        <p className="text-sm text-muted leading-relaxed border-t border-line pt-3">
          {summary}
        </p>
      )}
    </div>
  );
}
