import type { Metadata } from "next";
import { ClinicPage } from "@/components/clinic-page";
import { buildClinicMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildClinicMetadata("ru");

export default function ClinicRoute() {
  return <ClinicPage locale="ru" />;
}
