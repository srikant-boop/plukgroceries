export function AdminLogoutLink() {
  return (
    <form action="/api/admin/logout" method="post" className="inline">
      <button
        type="submit"
        className="underline underline-offset-4 hover:text-accent text-sm"
      >
        Log out
      </button>
    </form>
  );
}
