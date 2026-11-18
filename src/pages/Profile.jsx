
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import {
  UserRound,
  Heart,
  ShoppingCart,
  Settings,
  Package,
  LogOut,
  ArrowRight,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const name = user?.name || user?.username || "Lindt Customer";
  const email = user?.email || "No email available";
  const initial = name.charAt(0).toUpperCase();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    dispatch(logout());
    alert("You have been logged out successfully.");
    navigate("/login");
  };

  const accountLinks = [
    {
      title: "My Wishlist",
      description: "View your favourite chocolates",
      icon: Heart,
      path: "/wishlist",
    },
    {
      title: "My Cart",
      description: "Continue with your shopping",
      icon: ShoppingCart,
      path: "/cart",
    },
    {
      title: "Account Settings",
      description: "Manage your preferences",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-[#100906] px-5 pb-20 pt-32 text-white">
      <div className="mx-auto max-w-6xl">

        {/* Page Heading */}
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
            Lindt Account
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            My <span className="text-amber-500">Profile</span>
          </h1>

          <p className="mt-3 text-gray-400">
            Manage your account and explore your chocolate favourites.
          </p>
        </div>

        {/* Profile Header */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-[#382015] to-[#170D08] p-7 md:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative flex flex-col items-center gap-6 sm:flex-row">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-amber-500 bg-amber-600/20 text-4xl font-bold text-amber-400">
              {initial}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="mb-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h2 className="text-2xl font-bold md:text-3xl">
                  {name}
                </h2>

                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                  <ShieldCheck className="mr-1 inline h-4 w-4" />
                  Logged In
                </span>
              </div>

              <p className="flex items-center justify-center gap-2 text-gray-400 sm:justify-start">
                <Mail size={16} />
                {email}
              </p>

              <p className="mt-3 text-sm text-amber-400">
                Welcome to the sweet side of Lindt!
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-[#1C120D] p-7 lg:col-span-1">
            <div className="mb-6 flex items-center gap-3">
              <UserRound className="text-amber-500" size={24} />
              <h3 className="text-xl font-semibold">
                Personal Information
              </h3>
            </div>

            <div className="space-y-5">
              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-gray-500">
                  Full Name
                </p>
                <p className="font-medium">{name}</p>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-gray-500">
                  Email Address
                </p>
                <p className="break-all font-medium">{email}</p>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-gray-500">
                  Account Status
                </p>
                <p className="font-medium text-green-400">
                  Active
                </p>
              </div>
            </div>
          </div>

          {/* Account Links */}
          <div className="lg:col-span-2">
            <h3 className="mb-5 text-2xl font-bold">
              Your <span className="text-amber-500">Account</span>
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {accountLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    to={item.path}
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-[#1C120D] p-5 transition duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:bg-[#28180F]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 transition group-hover:bg-amber-500 group-hover:text-black">
                      <Icon size={23} />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-xs text-gray-400">
                        {item.description}
                      </p>
                    </div>

                    <ArrowRight
                      size={18}
                      className="text-gray-500 transition group-hover:translate-x-1 group-hover:text-amber-500"
                    />
                  </Link>
                );
              })}

              {/* Orders */}
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#1C120D] p-5 opacity-80">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Package size={23} />
                </div>

                <div>
                  <h4 className="font-semibold">My Orders</h4>
                  <p className="mt-1 text-xs text-gray-400">
                    Order history coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-[#3B2113] to-[#1D100A] p-8 text-center">
          <h3 className="text-2xl font-bold">
            Keep Your Life <span className="text-amber-500">Sweet!</span>
          </h3>

          <p className="mx-auto mt-3 max-w-lg text-sm text-gray-400">
            Explore our handcrafted chocolate collections and discover
            something delicious today.
          </p>

          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-600 px-7 py-3 font-semibold text-white transition hover:bg-amber-500"
          >
            Explore Chocolates
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
}
