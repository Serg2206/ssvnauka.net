export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import { lookupHistologyDb } from "@/lib/histology-db";

const querySchema = z.object({
  q: z.string().trim().min(2).max(80),
  limit: z.coerce.number().int().min(1).max(20).optional()
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    q: searchParams.get("q") ?? "",
    limit: searchParams.get("limit") ?? undefined
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Query must be between 2 and 80 characters."
      },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const results = await lookupHistologyDb(parsed.data.q, parsed.data.limit ?? 8);

    return NextResponse.json(
      {
        ok: true,
        query: parsed.data.q,
        results,
        totals: {
          oncotree: results.oncotree.length,
          hgnc: results.hgnc.length,
          ihc: results.ihc.length
        }
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Histology DB lookup failed", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Histology database is not available on this deployment yet."
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
