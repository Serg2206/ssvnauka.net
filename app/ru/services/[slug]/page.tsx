import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "@/components/service-page";
import { buildServiceMetadata } from "@/lib/metadata";
import { serviceSlugs, type ServiceSlug } from "@/lib/site-data";

type Params = { slug: ServiceSlug };

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const resolvedParams = await params;

  if (!serviceSlugs.includes(resolvedParams.slug)) {
    notFound();
  }

  return buildServiceMetadata("ru", resolvedParams.slug);
}

export default async function ServiceRoute({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params;

  if (!serviceSlugs.includes(resolvedParams.slug)) {
    notFound();
  }

  return <ServicePage locale="ru" slug={resolvedParams.slug} />;
}
