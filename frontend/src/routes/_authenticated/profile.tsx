import { createFileRoute } from "@tanstack/react-router";

import { userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { isPending, data: user, error } = useQuery(userQueryOptions);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-[350px] m-auto">
      <h1>Profile</h1>
      <p>{isPending ? "..." : `User: ${user.given_name}`}</p>
      <a href="/api/logout">Logout</a>
    </div>
  );
}
