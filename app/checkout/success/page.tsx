import Link from "next/link";
import { getPickupSpot, pickupSpots } from "@/lib/pickup";
import { getStripe } from "@/lib/stripe";
import { ClearCartOnSuccess } from "./ClearCartOnSuccess";
import { InviteShareLink } from "@/components/InviteShareLink";

type SearchParams = Promise<{ session_id?: string }>;

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { session_id: sessionId } = await searchParams;
  let spot = null;

  if (sessionId?.startsWith("cs_")) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      const pickupSpotId = session.metadata?.pickupSpotId;
      if (pickupSpotId) spot = getPickupSpot(pickupSpotId) ?? null;
    } catch {
      // Invalid or expired session — show generic pickup copy below.
    }
  }

  return (
    <div className="py-16 max-w-xl mx-auto text-center">
      <ClearCartOnSuccess />

      <h1 className="text-4xl mb-4">Thanks — you&apos;re in the next drop.</h1>
      <p className="text-muted text-lg mb-8 leading-relaxed">
        {spot
          ? "We'll see you at your pickup spot below."
          : "We'll be in touch about pickup."}
      </p>

      {spot && (
        <div className="border border-line bg-surface p-6 text-left mb-8">
          <p className="eyebrow mb-2">Your pickup</p>
          <p className="font-medium text-lg">{spot.name}</p>
          <p className="text-sm text-muted mt-1">
            {spot.address}
            <br />
            {spot.postal}
          </p>
          <p className="text-sm text-accent mt-3">{spot.slot}</p>
          <a
            href={spot.mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm underline underline-offset-2 mt-3 text-foreground"
          >
            Open in Maps
          </a>
        </div>
      )}

      <div className="border border-line p-6 text-left mb-10">
        <p className="eyebrow mb-3">What happens next</p>
        <ol className="space-y-3 text-sm leading-relaxed text-foreground/85 list-decimal pl-5">
          <li>
            We pack your order the morning of the drop, kept cold until pickup.
          </li>
          <li>
            Bring ID or your phone — we&apos;ll match you against the day&apos;s
            list
            {spot ? (
              <>
                {" "}
                at{" "}
                <span className="text-foreground font-medium">{spot.name}</span>
                .
              </>
            ) : (
              <>
                {" "}
                at the pickup spot:
                <ul className="mt-2 ml-4 space-y-1 text-muted list-disc">
                  {pickupSpots.map((s) => (
                    <li key={s.id}>
                      <span className="text-foreground">{s.name}</span> ·{" "}
                      {s.slot}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </li>
        </ol>
      </div>

      {sessionId?.startsWith("cs_") ? (
        <InviteShareLink sessionId={sessionId} />
      ) : null}

      <div className="flex gap-3 justify-center mt-10">
        <Link href="/" className="btn">
          Back to shop
        </Link>
        <Link href="/faq" className="btn btn-ghost">
          Read the FAQ
        </Link>
      </div>
    </div>
  );
}
