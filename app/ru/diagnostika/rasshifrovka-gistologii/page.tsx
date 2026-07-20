import type { Metadata } from "next";
import { HistologyToolPage } from "@/components/histology-tool-page";
import { buildHistologyToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildHistologyToolMetadata("ru");

function resolveAudience(value: string | string[] | undefined) {
  const normalized = Array.isArray(value) ? value[0] : value;
  if (normalized === "patients" || normalized === "doctors") {
    return normalized;
  }

  return "default";
}

export default async function HistologyToolRoute({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const audience = resolveAudience(resolvedSearchParams.audience);

  return <HistologyToolPage locale="ru" audience={audience} />;
}
