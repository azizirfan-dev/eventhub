import HomeClient from "./home-client";

export default async function HomeServer(props: any) {
  const searchParams = await props.searchParams;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const params = new URLSearchParams({
    limit: "12",
  });

  if (searchParams?.search) params.set("search", searchParams.search);
  if (searchParams?.category) params.set("category", searchParams.category);
  if (searchParams?.location) params.set("location", searchParams.location);
  if (searchParams?.sort) params.set("sort", searchParams.sort);

  const res = await fetch(`${apiUrl}/events?${params.toString()}`, {
    cache: "no-store",
  });

  const json = await res.json();

  return (
    <HomeClient
      initialEvents={json.data.events || []}
      initialFilters={searchParams}
    />
  );
}
