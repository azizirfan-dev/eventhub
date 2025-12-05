// src/app/payment/[id]/page.tsx
import { PaymentClient } from "@/components/payment/payment-client";

export default async function PaymentPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  return <PaymentClient transactionId={id} />;
}
