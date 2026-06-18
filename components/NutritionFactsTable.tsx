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
    <div className="overflow-hidden border border-line bg-surface">
      <div className="border-b border-line bg-background/80 px-4 py-3 sm:px-5">
        <p className="text-[11px] uppercase tracking-[0.12em] text-muted mb-2">
          Nutrition facts
        </p>
        <dl className="grid gap-2 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-muted text-xs mb-0.5">Serving size</dt>
            <dd className="font-medium">{facts.servingSize}</dd>
          </div>
          {facts.servingsPerPack && (
            <div>
              <dt className="text-muted text-xs mb-0.5">Servings per pack</dt>
              <dd className="font-medium">{facts.servingsPerPack}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="overflow-x-auto px-4 py-1 sm:px-5">
        <table className="w-full min-w-[280px] text-sm border-collapse">
          <thead>
            <tr className="border-b border-line">
              <th className="py-3 pr-4 text-left text-[11px] uppercase tracking-[0.1em] font-normal text-muted">
                Nutrient
              </th>
              {facts.columns.map((col) => (
                <th
                  key={col}
                  className="py-3 px-2 text-right text-[11px] uppercase tracking-[0.1em] font-normal text-muted whitespace-nowrap"
                >
                  {col === "perServe" ? perServeLabel : COLUMN_LABELS[col]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {facts.rows.map((row, index) =>
              row.isSection ? (
                <tr key={row.nutrient} className="bg-background/60">
                  <td
                    colSpan={facts.columns.length + 1}
                    className="py-2.5 pr-4 text-[11px] uppercase tracking-[0.12em] font-medium text-accent/80"
                  >
                    {row.nutrient}
                  </td>
                </tr>
              ) : (
                <tr
                  key={row.nutrient}
                  className={`border-b border-line/50 last:border-0 ${
                    index % 2 === 0 ? "" : "bg-background/30"
                  }`}
                >
                  <td className="py-2.5 pr-4 leading-snug text-foreground/90">
                    {row.nutrient}
                  </td>
                  {facts.columns.map((col) => (
                    <td
                      key={col}
                      className="py-2.5 px-2 text-right tabular-nums font-medium text-foreground/80 whitespace-nowrap"
                    >
                      {row[col] ?? "—"}
                    </td>
                  ))}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      {(facts.footnotes?.length || summary) && (
        <div className="border-t border-line bg-background/50 px-4 py-3 sm:px-5 space-y-1.5">
          {facts.footnotes?.map((note) => (
            <p key={note} className="text-xs text-muted leading-relaxed">
              {note}
            </p>
          ))}
          {summary && (
            <p className="text-xs text-muted leading-relaxed">{summary}</p>
          )}
        </div>
      )}
    </div>
  );
}
