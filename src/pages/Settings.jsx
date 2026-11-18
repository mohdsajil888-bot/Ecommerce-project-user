
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Bell,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  ChevronRight,
  Mail,
  PackageSearch,
} from "lucide-react";

import { logout } from "../features/auth/authSlice";
import {
  setNotifications,
  setAppearance,
} from "../features/settings/settingsSlice";

export default function Settings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const { notifications, appearance } = useSelector(
    (state) => state.settings
  );

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logout());
      alert("You have been logged out.");
      navigate("/login");
    }
  };

  return (
    <main className="min-h-screen bg-black px-5 pb-20 pt-36 text-white">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-10">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-amber-400"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
            Lindt Account
          </p>

          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
            Settings
          </h1>

          <p className="mt-3 text-white/50">
            Manage your account and personalize your experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[260px_1fr]">

          {/* SIDEBAR */}
          <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
                <UserRound size={23} />
              </div>

              <div className="min-w-0">
                <h3 className="truncate font-semibold">
                  {user?.name || "Guest User"}
                </h3>
                <p className="truncate text-xs text-white/40">
                  {user?.email || "Not logged in"}
                </p>
              </div>
            </div>

            <nav className="mt-5 space-y-2">
              <a
                href="#account"
                className="flex items-center gap-3 rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-400"
              >
                <UserRound size={18} />
                My Account
              </a>

              <Link
                to="/orders"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-amber-500/10 hover:text-amber-400"
              >
                <PackageSearch size={18} />
                Track My Orders
                <ChevronRight size={16} className="ml-auto" />
              </Link>

              <a
                href="#preferences"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 hover:bg-white/5"
              >
                <Bell size={18} />
                Preferences
              </a>

              <a
                href="#privacy"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 hover:bg-white/5"
              >
                <ShieldCheck size={18} />
                Privacy
              </a>
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <div className="space-y-7">

            {/* TRACK ORDERS CARD */}
            <Link
              to="/orders"
              className="group flex items-center gap-5 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-orange-500/5 p-6 transition hover:border-amber-500/50 sm:p-7"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400">
                <PackageSearch size={28} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold transition group-hover:text-amber-400">
                  Track My Orders
                </h2>
                <p className="mt-1 text-sm text-white/50">
                  View your purchases and check delivery progress.
                </p>
              </div>

              <ChevronRight
                size={22}
                className="shrink-0 text-amber-400 transition group-hover:translate-x-1"
              />
            </Link>

            {/* ACCOUNT */}
            <section
              id="account"
              className="scroll-mt-32 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <UserRound className="text-amber-400" size={22} />
                <div>
                  <h2 className="text-xl font-semibold">
                    Account Information
                  </h2>
                  <p className="text-sm text-white/40">
                    Your personal account details.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs uppercase tracking-widest text-white/40">
                    Full Name
                  </label>
                  <div className="mt-2 rounded-xl border border-white/10 bg-black/30 px-4 py-4">
                    {user?.name || "Guest User"}
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-white/40">
                    Email Address
                  </label>
                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-4">
                    <Mail size={17} className="text-amber-400" />
                    <span className="break-all">
                      {user?.email || "Not available"}
                    </span>
                  </div>
                </div>

                {!user && (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-black hover:bg-amber-400"
                  >
                    Login to Your Account
                    <ChevronRight size={17} />
                  </Link>
                )}
              </div>
            </section>

            {/* PREFERENCES */}
            <section
              id="preferences"
              className="scroll-mt-32 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <Bell className="text-amber-400" size={22} />
                <div>
                  <h2 className="text-xl font-semibold">Preferences</h2>
                  <p className="text-sm text-white/40">
                    Customize your website experience.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-white/10 py-5">
                <div>
                  <h3 className="font-medium">Notifications</h3>
                  <p className="mt-1 text-sm text-white/40">
                    Enable notification preferences.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => dispatch(setNotifications(!notifications))}
                  aria-label="Toggle notifications"
                  aria-pressed={notifications}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    notifications ? "bg-amber-500" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                      notifications ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 py-5">
                <div>
                  <h3 className="font-medium">Appearance</h3>
                  <p className="mt-1 text-sm text-white/40">
                    Choose your website appearance.
                  </p>
                </div>

                <select
                  value={appearance}
                  onChange={(e) => dispatch(setAppearance(e.target.value))}
                  className="rounded-full border border-white/10 bg-[#171717] px-4 py-2 text-sm text-white"
                >
                  <option value="dark">Dark</option>
                  <option value="light">
                    Light preference (preview only)
                  </option>
                </select>
              </div>
            </section>

            {/* PRIVACY */}
            <section
              id="privacy"
              className="scroll-mt-32 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-amber-400" size={22} />
                <div>
                  <h2 className="text-xl font-semibold">
                    Privacy & Information
                  </h2>
                  <p className="mt-1 text-sm text-white/40">
                    Manage your account experience.
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-white/50">
                Lindt is a demonstration website. Account data is managed
                by the project's JSON Server and the signed-in user is kept
                in browser storage. Do not use real passwords with this demo
                setup.
              </p>
            </section>

            {/* LOGOUT */}
            {user && (
              <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-6 sm:p-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-lg font-semibold">Sign Out</h2>
                    <p className="mt-1 text-sm text-white/40">
                      Sign out of your Lindt account.
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 rounded-full border border-red-500/30 px-6 py-3 text-sm font-semibold text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
