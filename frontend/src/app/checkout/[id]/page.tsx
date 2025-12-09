import CheckoutClient from "@/components/checkout/check-out-client";

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <CheckoutClient transactionId={id} />;
}
