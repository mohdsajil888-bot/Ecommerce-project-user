import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { logout, selectAuthUser } from "../features/auth/authSlice";

import {
  LayoutDashboard,
  Package,
  ArchiveRestore,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  Store,
  ChevronRight,
  UserRound,
} from "lucide-react";

const links = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/admin/products",
    label: "Products",
    icon: Package,
  },
  {
    to: "/admin/deleted-products",
    label: "Deleted Products",
    icon: ArchiveRestore,
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    to: "/admin/orders",
    label: "Orders",
    icon: ClipboardList,
  },
  {
    to: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
  {
    to: "/admin/profile",
    label: "Profile",
    icon: UserRound,
  },
];

const SCROLL_HIDE_THRESHOLD = 40;

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const admin = useSelector(selectAuthUser);

  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledDown(window.scrollY > SCROLL_HIDE_THRESHOLD);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const showSidebar = !isScrolledDown || isHovered;

  // Admin logout
  const handleLogout = () => {
    dispatch(logout());

    toast.success("Admin logged out successfully!");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#100b08] text-stone-100">
      {/* LEFT-EDGE HOVER TRIGGER WHEN SIDEBAR IS HIDDEN */}
      {isScrolledDown && !isHovered && (
        <div
          aria-label="Show sidebar"
          onMouseEnter={() => setIsHovered(true)}
          className="fixed inset-y-0 left-0 z-40 hidden w-4 cursor-pointer items-center justify-center md:flex"
        >
          <div className="flex h-14 w-4 items-center justify-center rounded-r-lg border border-l-0 border-amber-500/40 bg-[#19110c]/95 text-amber-400 shadow-lg">
            <ChevronRight size={13} />
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-full overflow-y-auto border-b border-amber-900/30 bg-[#19110c] p-5 transition-transform duration-300 ease-out md:fixed md:inset-y-0 md:left-0 md:z-40 md:h-screen md:w-64 md:border-b-0 md:border-r ${
          showSidebar
            ? "md:pointer-events-auto md:translate-x-0 md:shadow-2xl md:shadow-black/50"
            : "md:pointer-events-none md:-translate-x-full"
        }`}
      >
          {/* LOGO */}
          <div className="mb-7 flex items-center gap-3">
            <div className="rounded-xl bg-amber-500 p-2 text-black">
              <Store size={22} />
            </div>

            <div>
              <p className="text-xl font-bold tracking-[0.18em]">LINDT</p>

              <p className="text-xs text-amber-500">ADMINISTRATION</p>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-amber-500 font-semibold text-black shadow-md shadow-amber-500/20"
                      : "text-stone-300 hover:bg-white hover:text-black"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ADMIN PROFILE */}
          <div className="mt-7 border-t border-white/10 pt-5">
            <p className="font-medium">{admin?.name || "Administrator"}</p>

            <p className="mb-4 text-xs text-stone-400">{admin?.email}</p>

            {/* LOGOUT BUTTON */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-amber-400 transition-all duration-300 hover:bg-white hover:text-black"
            >
              <LogOut size={17} />
              Sign out
            </button>
        </div>
      </aside>

      {/* ADMIN PAGE CONTENT */}
      <main
        className={`min-w-0 p-4 transition-[margin] duration-300 ease-out sm:p-7 lg:p-9 ${
          showSidebar ? "md:ml-64" : "md:ml-0"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
