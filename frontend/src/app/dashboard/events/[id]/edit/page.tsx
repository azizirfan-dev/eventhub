
import { use } from "react";
import EventEditClient from "@/components/dashboard/events/event-edit-client";

async function getEvent(id: string) {
  const base = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${base}/events/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()).data;
}

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <EventEditClient event={use(getEvent(id))} />;
}
