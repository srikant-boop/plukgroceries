import Link from "next/link";

type Props = {
  /** Checkout uses a tighter layout above the form. */
  variant?: "default" | "compact";
};

export function InviteNeighborCallout({ variant = "default" }: Props) {
  const compact = variant === "compact";

  return (
    <div
      className={`border border-line bg-surface text-sm leading-relaxed ${
        compact ? "p-4" : "p-5 sm:p-6"
      }`}
    >
      <p className="font-medium text-foreground">
        Invite a neighbour — get wholesale prices on your order
      </p>
      <p className={`text-foreground/75 ${compact ? "mt-1.5" : "mt-2"}`}>
        After you order, copy your personal invite link on the confirmation page
        and share it. When someone new orders through that link this drop, we&apos;ll
        adjust your bag to wholesale prices after their order is paid.
      </p>
      <Link
        href="/faq#invite-a-neighbour"
        className="mt-3 inline-block text-xs underline underline-offset-4 hover:text-accent"
      >
        How it works →
      </Link>
    </div>
  );
}
