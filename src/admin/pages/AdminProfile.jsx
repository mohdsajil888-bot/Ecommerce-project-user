import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  UserRound,
  Mail,
  ShieldCheck,
  LogOut,
  KeyRound,
  Clock,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Camera,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import { logout, selectAuthUser } from "../../features/auth/authSlice";
import { API_URL } from "../../services/api";

// ── Helpers ────────────────────────────────────────────────────────────────

function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Very Weak", color: "bg-red-500" };
  if (score === 2) return { score, label: "Weak", color: "bg-orange-500" };
  if (score === 3) return { score, label: "Fair", color: "bg-yellow-500" };
  if (score === 4) return { score, label: "Strong", color: "bg-green-500" };
  return { score, label: "Very Strong", color: "bg-emerald-400" };
}

// localStorage key for profile photo
const PHOTO_KEY = (adminId) => `admin-photo-${adminId}`;

// ── Component ─────────────────────────────────────────────────────────────

export default function AdminProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector(selectAuthUser);

  const name = admin?.name || "Administrator";
  const email = admin?.email || "No email available";
  const role = admin?.role || "admin";
  const initial = name.charAt(0).toUpperCase();

  // ── Profile photo ──────────────────────────────────────────────────────
  const photoKey = PHOTO_KEY(admin?.id);
  const [photo, setPhoto] = useState(
    () => localStorage.getItem(photoKey) || null
  );
  const [photoLoading, setPhotoLoading] = useState(false);
  const fileRef = useRef(null);

  const handlePhotoClick = () => fileRef.current?.click();

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2 MB.");
      return;
    }

    setPhotoLoading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      localStorage.setItem(photoKey, dataUrl);
      setPhoto(dataUrl);
      setPhotoLoading(false);
      toast.success("Profile photo updated!");
    };
    reader.onerror = () => {
      setPhotoLoading(false);
      toast.error("Failed to read image.");
    };
    reader.readAsDataURL(file);

    // reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleRemovePhoto = () => {
    localStorage.removeItem(photoKey);
    setPhoto(null);
    toast.success("Profile photo removed.");
  };

  // ── Change Password ────────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [show, setShow] = useState({ current: false, newPw: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);

  const strength = getStrength(pwForm.newPw);
  const passwordsMatch = pwForm.newPw && pwForm.confirm && pwForm.newPw === pwForm.confirm;
  const passwordsMismatch = pwForm.confirm && pwForm.newPw !== pwForm.confirm;

  const toggleShow = (field) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const handlePwChange = (e) =>
    setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (pwForm.newPw !== pwForm.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    if (pwForm.newPw.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (pwForm.newPw === pwForm.current) {
      toast.error("New password must be different from the current one.");
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch(`${API_URL}/admins/${admin.id}`);
      if (!res.ok) throw new Error("Could not fetch admin record.");
      const record = await res.json();

      if (record.password !== pwForm.current) {
        toast.error("Current password is incorrect.");
        return;
      }

      const patchRes = await fetch(`${API_URL}/admins/${admin.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwForm.newPw }),
      });
      if (!patchRes.ok) throw new Error("Failed to update password.");

      toast.success("Password changed successfully!");
      setPwForm({ current: "", newPw: "", confirm: "" });
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Admin logged out successfully!");
    navigate("/login", { replace: true });
  };

  // ── Password input helper ──────────────────────────────────────────────
  const PwInput = ({ label, fieldKey, placeholder }) => (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-stone-500">
        {label}
      </label>
      <div className="relative">
        <Lock
          size={15}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500"
        />
        <input
          type={show[fieldKey] ? "text" : "password"}
          name={fieldKey}
          value={pwForm[fieldKey]}
          onChange={handlePwChange}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full rounded-xl border border-white/10 bg-[#100b08] py-2.5 pl-9 pr-10 text-sm text-stone-100 placeholder-stone-600 outline-none transition focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30"
        />
        <button
          type="button"
          onClick={() => toggleShow(fieldKey)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 transition hover:text-amber-400"
        >
          {show[fieldKey] ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen text-stone-100">

      {/* ── Page Header ───────────────────────────────────────── */}
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
          Administration
        </p>
        <h1 className="text-3xl font-bold md:text-4xl">
          Admin <span className="text-amber-500">Profile</span>
        </h1>
        <p className="mt-2 text-sm text-stone-400">
          Manage your administrator account details and security.
        </p>
      </div>

      {/* ── Profile Hero Card ─────────────────────────────────── */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-amber-900/40 bg-gradient-to-br from-[#2a1a0e] to-[#1b120a] p-7 md:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-amber-800/10 blur-3xl" />

        <div className="relative flex flex-col items-center gap-6 sm:flex-row">

          {/* ── Avatar with upload ── */}
          <div className="relative shrink-0">
            {/* Hidden file input */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />

            {/* Avatar circle */}
            <div className="relative h-24 w-24">
              {photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="h-24 w-24 rounded-full border-2 border-amber-500 object-cover shadow-lg shadow-amber-900/30"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-amber-500 bg-amber-600/20 text-4xl font-bold text-amber-400 shadow-lg shadow-amber-900/30">
                  {photoLoading ? (
                    <span className="h-7 w-7 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-400" />
                  ) : (
                    initial
                  )}
                </div>
              )}

              {/* Camera overlay button */}
              <button
                type="button"
                onClick={handlePhotoClick}
                title="Change profile photo"
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#2a1a0e] bg-amber-500 text-black shadow-md transition hover:bg-amber-400 active:scale-95"
              >
                <Camera size={14} />
              </button>
            </div>

            {/* Remove photo link */}
            {photo && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="mt-2 flex w-full items-center justify-center gap-1 text-[11px] text-stone-500 transition hover:text-red-400"
              >
                <Trash2 size={11} />
                Remove
              </button>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="mb-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="text-2xl font-bold md:text-3xl">{name}</h2>
              <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-400 ring-1 ring-amber-500/30">
                <ShieldCheck size={13} />
                Administrator
              </span>
            </div>
            <p className="flex items-center justify-center gap-2 text-sm text-stone-400 sm:justify-start">
              <Mail size={15} />
              {email}
            </p>
            <p className="mt-3 text-xs text-stone-500 capitalize">
              Role:{" "}
              <span className="font-semibold text-amber-400">{role}</span>
            </p>

            {/* Upload hint */}
            <button
              type="button"
              onClick={handlePhotoClick}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 px-3 py-1.5 text-xs font-medium text-amber-400 transition hover:bg-amber-500/10"
            >
              <Camera size={13} />
              {photo ? "Change Photo" : "Upload Photo"}
            </button>
          </div>

          {/* Sign out */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-red-500/30 px-5 py-2.5 text-sm font-semibold text-red-400 transition-all duration-200 hover:bg-red-500 hover:text-white"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </div>

      {/* ── Info Cards ────────────────────────────────────────── */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {/* Personal Info */}
        <div className="rounded-2xl border border-white/10 bg-[#1b130e] p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <UserRound size={20} />
            </div>
            <h3 className="font-semibold">Personal Information</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-stone-500">Full Name</p>
              <p className="text-sm font-medium">{name}</p>
            </div>
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-stone-500">Email Address</p>
              <p className="break-all text-sm font-medium">{email}</p>
            </div>
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-stone-500">Account Role</p>
              <p className="text-sm font-medium capitalize text-amber-400">{role}</p>
            </div>
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-stone-500">Profile Photo</p>
              <p className="flex items-center gap-1.5 text-sm font-medium">
                {photo ? (
                  <span className="flex items-center gap-1.5 text-green-400">
                    <CheckCircle2 size={13} /> Uploaded
                  </span>
                ) : (
                  <span className="text-stone-500">Not set</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Access Level */}
        <div className="rounded-2xl border border-white/10 bg-[#1b130e] p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <KeyRound size={20} />
            </div>
            <h3 className="font-semibold">Access Level</h3>
          </div>
          <div className="space-y-3">
            {[
              "Manage Products",
              "Manage Orders",
              "Manage Users",
              "View Dashboard Analytics",
              "Access Admin Settings",
            ].map((perm) => (
              <div key={perm} className="flex items-center gap-2">
                <ShieldCheck size={14} className="shrink-0 text-amber-500" />
                <span className="text-sm text-stone-300">{perm}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Session Info */}
        <div className="rounded-2xl border border-white/10 bg-[#1b130e] p-6 sm:col-span-2 lg:col-span-1">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Clock size={20} />
            </div>
            <h3 className="font-semibold">Session</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-stone-500">Status</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Active
              </span>
            </div>
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-stone-500">Authentication</p>
              <p className="text-sm font-medium text-stone-300">Locally authenticated</p>
            </div>
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-stone-500">Platform</p>
              <p className="text-sm font-medium text-stone-300">Lindt Admin Panel</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECURITY SECTION ─────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#1b130e]">
        {/* Section header */}
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Lock size={20} />
          </div>
          <div>
            <h3 className="font-semibold">Security</h3>
            <p className="text-xs text-stone-500">Manage your password and account security</p>
          </div>
        </div>

        <div className="p-6 lg:grid lg:grid-cols-2 lg:gap-10">
          {/* Change Password form */}
          <div>
            <h4 className="mb-5 flex items-center gap-2 text-sm font-semibold text-stone-200">
              <KeyRound size={15} className="text-amber-500" />
              Change Password
            </h4>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <PwInput label="Current Password" fieldKey="current" placeholder="Enter current password" />
              <PwInput label="New Password" fieldKey="newPw" placeholder="Enter new password" />

              {/* Strength bar */}
              {pwForm.newPw && (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div
                        key={s}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          s <= strength.score ? strength.color : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    strength.score <= 1 ? "text-red-400"
                    : strength.score === 2 ? "text-orange-400"
                    : strength.score === 3 ? "text-yellow-400"
                    : "text-green-400"
                  }`}>
                    {strength.label}
                  </p>
                </div>
              )}

              <PwInput label="Confirm New Password" fieldKey="confirm" placeholder="Repeat new password" />

              {/* Match feedback */}
              {pwForm.confirm && (
                <p className={`flex items-center gap-1.5 text-xs font-medium ${passwordsMatch ? "text-green-400" : "text-red-400"}`}>
                  {passwordsMatch
                    ? <><CheckCircle2 size={13} /> Passwords match</>
                    : <><XCircle size={13} /> Passwords do not match</>}
                </p>
              )}

              <button
                type="submit"
                disabled={pwLoading || passwordsMismatch || !pwForm.newPw}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pwLoading
                  ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/40 border-t-black" />
                  : <Lock size={15} />}
                {pwLoading ? "Updating…" : "Update Password"}
              </button>
            </form>
          </div>

          {/* Security Tips */}
          <div className="mt-8 lg:mt-0">
            <h4 className="mb-5 flex items-center gap-2 text-sm font-semibold text-stone-200">
              <ShieldCheck size={15} className="text-amber-500" />
              Security Tips
            </h4>

            <div className="space-y-3">
              {[
                { icon: CheckCircle2, color: "text-green-400", tip: "Use at least 8 characters in your password." },
                { icon: CheckCircle2, color: "text-green-400", tip: "Mix uppercase, lowercase, numbers, and symbols." },
                { icon: CheckCircle2, color: "text-green-400", tip: "Never share your admin credentials with anyone." },
                { icon: AlertTriangle, color: "text-amber-400", tip: "Change your password regularly (every 3–6 months)." },
                { icon: AlertTriangle, color: "text-amber-400", tip: "Always sign out when leaving the admin panel." },
                { icon: XCircle, color: "text-red-400", tip: "Don't use easily guessable passwords like your name or date of birth." },
              ].map(({ icon: Icon, color, tip }) => (
                <div key={tip} className="flex items-start gap-2.5">
                  <Icon size={15} className={`mt-0.5 shrink-0 ${color}`} />
                  <p className="text-sm text-stone-400">{tip}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-green-400">
                <ShieldCheck size={16} />
                Account Secured
              </div>
              <p className="mt-1 text-xs text-stone-500">
                Your admin account is active and protected. Keep your credentials safe.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer banner ─────────────────────────────────────── */}
      <div className="mt-8 rounded-2xl border border-amber-900/30 bg-gradient-to-r from-[#2a1800] to-[#1a0e06] p-7 text-center">
        <ShieldCheck size={28} className="mx-auto mb-3 text-amber-500" />
        <h3 className="text-lg font-bold">
          Lindt <span className="text-amber-500">Administration</span>
        </h3>
        <p className="mt-2 text-sm text-stone-500">
          You have full administrative access to the Lindt store management system.
        </p>
      </div>
    </div>
  );
}
