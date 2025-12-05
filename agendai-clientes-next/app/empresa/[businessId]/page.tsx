import { BusinessDetailsPage } from "../../../src/features/business/BusinessDetailsPage";

export default async function EmpresaPage({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params;
  return <BusinessDetailsPage businessId={businessId} />;
}
