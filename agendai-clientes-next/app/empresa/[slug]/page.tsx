import { BusinessDetailsPageWrapper } from "./BusinessDetailsPageWrapper";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  
  return <BusinessDetailsPageWrapper slug={slug} />;
}
