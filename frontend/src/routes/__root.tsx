import { type QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
});

function NavBar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-black text-white p-4 flex justify-center items-center shadow-md">
      <h1
        className="text-2xl font-bold mr-10"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        Jacob's <span className="text-blue-500">Expenses</span>
      </h1>
      <div className="flex flex-row items-center justify-center space-x-2">
        {[
          { path: "/", label: "Home" },
          { path: "/about", label: "About" },
          { path: "/expenses", label: "Expenses" },
          { path: "/create-expense", label: "Create" },
          { path: "/profile", label: "Profile" },
        ].map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              isActive(item.path)
                ? "bg-blue-500"
                : "hover:bg-[rgba(255,255,255,0.2)]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function Root() {
  return (
    <>
      <NavBar />
      <hr />
      <div className="max-w-2xl m-auto p-2">
        <Outlet />
      </div>
      {/* <TanStackRouterDevtools /> */}
      <Toaster />
    </>
  );
}
