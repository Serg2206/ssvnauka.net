import type { Metadata } from "next";
import { SitePage } from "@/components/site-page";
import { buildHomeMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildHomeMetadata("en");

export default function HomePage() {
  return <SitePage locale="en" />;
}
