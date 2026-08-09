import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AUTH_API = "/api/auth";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // UI Action States
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Password Visibility Toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (!user && !token) {
      navigate("/login", { replace: true });
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${AUTH_API}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile({
            fullName: data.fullName || "",
            email: data.email || "",
          });
        } else {
          setProfile({
            fullName: user?.fullName || "",
            email: user?.email || "",
          });
        }
      } catch {
        setProfile({
          fullName: user?.fullName || "",
          email: user?.email || "",
        });
      } finally {
        setIsFetchingProfile(false);
      }
    };
    fetchProfile();
  }, [token, user]);

  const getInitials = (nameString) => {
    if (!nameString) return "?";
    return nameString
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsSavingProfile(true);

    try {
      const res = await fetch(`${AUTH_API}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: profile.fullName,
          email: profile.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      updateUser({ fullName: data.fullName, email: data.email });
      setStatusMessage({
        type: "success",
        text: "Profile updated successfully.",
      });
    } catch (err) {
      setStatusMessage({ type: "error", text: err.message });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setStatusMessage({
        type: "error",
        text: "New passwords do not match.",
      });
      return;
    }

    if (passwordState.newPassword.length < 8) {
      setStatusMessage({
        type: "error",
        text: "Password must be at least 8 characters.",
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await fetch(`${AUTH_API}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordState.currentPassword,
          newPassword: passwordState.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");

      setPasswordState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setStatusMessage({
        type: "success",
        text: "Password changed successfully.",
      });
    } catch (err) {
      setStatusMessage({ type: "error", text: err.message });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isFetchingProfile) {
    return (
      <div className="w-full max-w-5xl mx-auto p-6 md:p-10 font-body text-on-surface bg-surface-bright min-h-screen space-y-8 overflow-y-auto flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-10 font-body text-on-surface bg-surface-bright min-h-screen space-y-8 overflow-y-auto">
      {/* Configuration Hub Header Section */}
      <div className="border-b border-outline-variant pb-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-low px-3 py-2 text-sm font-medium text-on-surface transition hover:bg-surface-container"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">
          Account Settings
        </h1>
        <p className="text-on-surface-variant text-base mt-1 opacity-80">
          Manage your interface presentation identities and application access
          authentication mechanisms.
        </p>
      </div>

      {/* Global Toast Alert Broadcast Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 border shadow-sm transition-all duration-300 ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="text-base font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* Primary Context Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column Component: Profile Identity Card Preview */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm text-center flex flex-col items-center">
          {/* Dynamic Initials Avatar Render */}
          <div className="w-24 h-24 rounded-full bg-primary text-on-primary flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-surface mb-4 select-none">
            {getInitials(profile.fullName)}
          </div>

          <h3 className="text-xl font-bold text-on-surface tracking-tight">
            {profile.fullName}
          </h3>
          <p className="text-sm font-medium text-on-surface-variant/70 break-all px-2">
            {profile.email}
          </p>

          <div className="mt-5 w-full pt-4 border-t border-outline-variant flex items-center justify-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider bg-surface-container-low py-2 rounded-lg">
            <Shield size={14} />
            <span>Authorized Analyst Data Access</span>
          </div>
        </div>

        {/* Right Columns Component: Multi-Form Configuration Panels */}
        <div className="lg:col-span-2 space-y-8">
          {/* Form Block One: Identity Parameters */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant">
              <User size={18} className="text-primary" />
              <h2 className="text-lg font-semibold tracking-tight">
                Profile Credentials
              </h2>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={profile.fullName}
                    onChange={(e) =>
                      setProfile({ ...profile, fullName: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-base focus:outline-none transition-all text-on-surface"
                  />
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                  Email Destination Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-base focus:outline-none transition-all text-on-surface"
                  />
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition shadow-sm flex items-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
                >
                  <Save size={16} />
                  {isSavingProfile
                    ? "Saving Configurations..."
                    : "Save Identity Records"}
                </button>
              </div>
            </form>
          </div>

          {/* Form Block Two: Authentication Change Password Component */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant">
              <Lock size={18} className="text-primary" />
              <h2 className="text-lg font-semibold tracking-tight">
                Modify Account Password
              </h2>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                  Current Active Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={passwordState.currentPassword}
                    onChange={(e) =>
                      setPasswordState({
                        ...passwordState,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-base focus:outline-none transition-all text-on-surface"
                    placeholder="••••••••••••"
                  />
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                    New Password Target
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={passwordState.newPassword}
                      onChange={(e) =>
                        setPasswordState({
                          ...passwordState,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full pl-11 pr-12 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-base focus:outline-none transition-all text-on-surface"
                      placeholder="Min. 8 characters"
                    />
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={passwordState.confirmPassword}
                      onChange={(e) =>
                        setPasswordState({
                          ...passwordState,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-base focus:outline-none transition-all text-on-surface"
                      placeholder="Repeat token match"
                    />
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition shadow-sm flex items-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
                >
                  <Lock size={16} />
                  {isChangingPassword
                    ? "Updating Credentials..."
                    : "Commit New Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
