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
        Invite a neighbour — wholesale prices for both of you
      </p>
      <p className={`text-foreground/75 ${compact ? "mt-1.5" : "mt-2"}`}>
        Inviting someone new? Add their name at checkout. Were you invited? Add
        your neighbour&apos;s name too. Once both orders are paid, we&apos;ll
        adjust both bags to wholesale prices.
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
