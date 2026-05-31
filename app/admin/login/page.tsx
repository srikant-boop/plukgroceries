type SearchParams = Promise<{ from?: string; error?: string }>;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { from, error } = await searchParams;
  return (
    <div className="py-16 max-w-sm mx-auto">
      <h1 className="text-3xl mb-2">Pluk admin</h1>
      <p className="text-muted text-sm mb-8">Password gate.</p>
      <form action="/api/admin/login" method="POST" className="space-y-4">
        <input type="hidden" name="from" value={from ?? "/admin"} />
        <label className="block">
          <span className="block text-xs text-muted mb-1.5">Password</span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="w-full border border-line bg-surface p-3 text-sm focus:outline-none focus:border-foreground"
          />
        </label>
        {error && (
          <p className="text-xs text-price-cut">
            {error === "wrong"
              ? "Wrong password."
              : "ADMIN_PASSWORD env var isn't set yet."}
          </p>
        )}
        <button type="submit" className="btn w-full">
          Sign in
        </button>
      </form>
    </div>
  );
}
