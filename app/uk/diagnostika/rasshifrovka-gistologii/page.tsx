import type { Metadata } from "next";
import { HistologyToolPage } from "@/components/histology-tool-page";
import { buildHistologyToolMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildHistologyToolMetadata("uk");

export default function HistologyToolRoute() {
  return <HistologyToolPage locale="uk" />;
}
