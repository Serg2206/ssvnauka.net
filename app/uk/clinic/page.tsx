import type { Metadata } from "next";
import { ClinicPage } from "@/components/clinic-page";
import { buildClinicMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildClinicMetadata("uk");

export default function ClinicRoute() {
  return <ClinicPage locale="uk" />;
}
