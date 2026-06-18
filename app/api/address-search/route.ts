import { NextResponse } from "next/server";
import {
  formatCanadianAddress,
  OAKVILLE_VIEWBOX,
  type AddressSuggestion,
} from "@/lib/address-search";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 3) {
    return NextResponse.json([] satisfies AddressSuggestion[]);
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "6");
  url.searchParams.set("countrycodes", "ca");
  url.searchParams.set("viewbox", OAKVILLE_VIEWBOX);
  url.searchParams.set("bounded", "1");

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "PlukGrocery/1.0 (https://roots-pantry.vercel.app)",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json([] satisfies AddressSuggestion[]);
    }

    const data = (await res.json()) as Array<{
      place_id: number;
      display_name: string;
    }>;

    const suggestions: AddressSuggestion[] = data.map((item) => ({
      id: String(item.place_id),
      label: formatCanadianAddress(item.display_name),
    }));

    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json([] satisfies AddressSuggestion[]);
  }
}
