import { createFileRoute } from "@tanstack/react-router";
import { userQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { isPending, data: user, error } = useQuery(userQueryOptions);

  if (error)
    return (
      <div className="text-red-500 p-4 max-w-md m-auto text-center">
        Error: {error.message}
      </div>
    );
  if (isPending) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="w-[350px] m-auto mt-10 p-6 shadow-lg rounded-lg border">
      <h1 className="text-xl font-semibold text-center mb-4">Profile</h1>
      <div className="flex justify-center mb-4">
        <Avatar>
          <AvatarImage
            src={user?.picture || "https://github.com/shadcn.png"}
            alt="User avatar"
          />
          <AvatarFallback>{user?.given_name?.[0] || "C"}</AvatarFallback>
        </Avatar>
      </div>
      <p className="text-center mb-4">{`${user?.given_name + " " + user?.family_name || "Not available"}`}</p>
      <div className="text-center">
        <a
          href="/api/logout"
          className="text-blue-500 hover:text-blue-700 transition duration-300"
        >
          Logout
        </a>
      </div>
    </div>
  );
}

export default Profile;
