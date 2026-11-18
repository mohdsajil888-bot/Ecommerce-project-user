
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../features/auth/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { getUsers, createUser } from "../services/userService";

export default function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const destination = location.state?.from || "/shop";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const users = await getUsers();
      const cleanEmail = email.trim().toLowerCase();

      if (isLogin) {
        const existingUser = users.find(
          (user) =>
            user.email?.toLowerCase() === cleanEmail &&
            user.password === password
        );

        if (!existingUser) {
          setMessage("Invalid email or password.");
          return;
        }

        const loggedInUser = {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
        };

        dispatch(setUser(loggedInUser));
        localStorage.setItem("chocoart-user", JSON.stringify(loggedInUser));

        alert("Login successful! Welcome back, " + existingUser.name + "!");
        navigate(destination, { replace: true });
      } else {
        if (!name.trim()) {
          setMessage("Please enter your name.");
          return;
        }

        const existingUser = users.find(
          (user) => user.email?.toLowerCase() === cleanEmail
        );

        if (existingUser) {
          setMessage("This email is already registered. Please login.");
          return;
        }

        if (password.length < 6) {
          setMessage("Password must contain at least 6 characters.");
          return;
        }

        await createUser({ name: name.trim(), email: cleanEmail, password });

        alert("Your account has been created successfully! Please login.");
        setIsLogin(true);
        setName("");
        setPassword("");
        setEmail(cleanEmail);
        setMessage("");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setMessage(
        "Unable to connect to JSON Server. Please make sure it is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-black px-4 py-12 text-white">
      <Link
        to="/"
        className="fixed left-5 top-5 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-[#111111] px-5 py-3 text-sm text-gray-300 shadow-lg transition hover:border-amber-500 hover:text-amber-400 sm:left-8 sm:top-8"
      >
        <ArrowLeft size={18} />
        Back to Home
      </Link>

      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-[#111111] shadow-2xl lg:grid-cols-2">
        {/* LEFT IMAGE SECTION */}
        <div className="relative hidden min-h-[650px] lg:block">
          <img
            src="https://aejmlyuldr.cloudimg.io/keimling.de/media/80/ec/b6/1739538895/Rohkost_Dubai.jpg?func=bound&org_if_sml=1&w=3000"
            alt="Luxury dark chocolate with green pistachio filling"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />

          <div className="absolute left-10 top-10">
            <Link to="/">
              <img
                src="/logo.png"
                alt="Lindt"
                className="h-16 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="absolute bottom-12 left-10 right-10">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
              Welcome to Lindt
            </p>

            <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
              A Little Sweetness
              <br />
              Goes a Long Way.
            </h1>

            <p className="mt-5 max-w-md leading-7 text-gray-300">
              Discover handcrafted chocolates, delicious flavours, and
              unforgettable moments with every bite.
            </p>
          </div>
        </div>

        {/* RIGHT AUTHENTICATION SECTION */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-14">
          <div className="w-full max-w-md">
            {/* LOGO FOR MOBILE */}
            <div className="mb-8 flex justify-center lg:hidden">
              <Link to="/">
                <img
                  src="/logo.png"
                  alt="Lindt"
                  className="h-16 w-auto object-contain"
                />
              </Link>
            </div>

            {/* HEADING */}
            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-amber-500">
                {isLogin ? "Welcome Back" : "Join Lindt"}
              </p>

              <h2 className="text-3xl font-bold sm:text-4xl">
                {isLogin ? "Login to your account" : "Create an account"}
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                {isLogin
                  ? "Enter your details to continue your chocolate journey."
                  : "Create your account and discover our delicious collection."}
              </p>
            </div>

            {/* LOGIN / SIGNUP TOGGLE */}
            <div className="mb-8 flex rounded-xl border border-white/10 bg-white/[0.04] p-1">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setMessage("");
                }}
                className={`flex-1 rounded-lg py-3 text-sm font-semibold transition ${
                  isLogin
                    ? "bg-amber-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setMessage("");
                }}
                className={`flex-1 rounded-lg py-3 text-sm font-semibold transition ${
                  !isLogin
                    ? "bg-amber-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* AUTH FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required={!isLogin}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-4 pr-12 text-white outline-none transition placeholder:text-gray-500 focus:border-amber-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-amber-400"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {message && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-amber-600 py-4 font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                    ? "Login to Account"
                    : "Create Account"}

                {!loading && <ArrowRight size={19} />}
              </button>
            </form>

            {/* BOTTOM TEXT */}
            <p className="mt-8 text-center text-sm text-gray-400">
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage("");
                }}
                className="ml-2 font-semibold text-amber-500 transition hover:text-amber-400"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
