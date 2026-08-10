import { MOCK_SERVERS } from '@/lib/data';
import ServerDetailPageClient from './ServerDetailPageClient';

// Generates static paths for all servers during export
export function generateStaticParams() {
  return MOCK_SERVERS.map((server) => ({
    slug: server.slug,
  }));
}

interface ServerDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: ServerDetailPageProps) {
  const { slug } = await params;
  return <ServerDetailPageClient slug={slug} />;
}
