import React, { useState } from "react";
import {
  Mail,
  ArrowLeft,
  Sparkles,
  Send,
  Key,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, resetPassword } = useAuth();

  // Step states: 'email' -> 'otp' -> 'password' -> 'success'
  const [step, setStep] = useState("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.95,
      transition: { duration: 0.3 },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // --- LOGIC STARTS HERE (Unchanged) ---

  // Step 1: Send OTP to email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await sendOtp(email);
      setStep("otp");
      startTimer();
      toast.success("OTP sent successfully! Check your email.");
    } catch (err) {
      console.error("Send OTP error:", err);
      setError(err.message || "An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const otpCode = otp.join("");

    try {
      await verifyOtp(email, otpCode);
      setStep("password");
      toast.success("OTP verified successfully!");
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError(err.message || "An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(email, otp.join(""), newPassword);
      setStep("success");
      toast.success("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Reset password error:", err);
      setError(err.message || "An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (timer > 0) return;

    setError("");
    setIsLoading(true);
    setOtp(["", "", "", "", "", ""]);

    try {
      await sendOtp(email);
      startTimer();
      toast.success("OTP resent successfully!");
    } catch (err) {
      console.error("Resend OTP error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Timer for resend OTP
  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle OTP input change
  const handleOTPChange = (index, value) => {
    if (value.length > 1) value = value.slice(0, 1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Handle OTP paste
  const handleOTPPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length - 1, 5);
    document.getElementById(`otp-${lastIndex}`)?.focus();
  };

  // Handle backspace
  const handleOTPKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // --- RENDER ---
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex font-body bg-slate-50 text-slate-900 selection:bg-indigo-100 overflow-hidden"
    >
      {/* LEFT PANEL - Branding */}
      <motion.div
        variants={itemVariants}
        className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12"
      >
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.history.back()}
          className="absolute top-8 left-8 z-20 flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 group"
          aria-label="Go back"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span className="text-sm font-medium">Back</span>
        </motion.button>

        {/* Decorative background elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"
        />

        <div className="relative z-10 max-w-lg">
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 text-white font-bold text-2xl tracking-tight mb-12"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <BarChart3 size={28} className="text-indigo-400" />
            </motion.div>
            <span>DataAgent AI</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight"
          >
            Reset your access to your data partner.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-slate-300 mb-10 leading-relaxed"
          >
            Don't worry, we've got you covered. Enter your registered email and
            follow the steps to securely reset your password and regain access
            to your data analytics platform.
          </motion.p>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 text-slate-300 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ShieldCheck
                size={24}
                className="text-emerald-400 flex-shrink-0"
              />
            </motion.div>
            <p className="text-sm">
              Your security is our priority. All password reset requests are
              processed through encrypted channels with multi-factor
              verification.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* RIGHT PANEL - Reset Password Form */}
      <motion.div
        variants={itemVariants}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12"
      >
        <motion.div
          variants={cardVariants}
          whileHover={{ boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}
          className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100 relative min-h-[500px]"
        >
          {/* Mobile Back Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="lg:hidden flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors duration-200 mb-4"
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">Back</span>
          </motion.button>

          {/* Mobile Logo */}
          <motion.div
            variants={itemVariants}
            className="flex lg:hidden items-center justify-center gap-2 text-indigo-600 font-bold text-xl tracking-tight"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <BarChart3 size={24} />
            </motion.div>
            <span>DataAgent AI</span>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* STEP 1: Email Input */}
            {step === "email" && (
              <motion.div
                key="step1"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="text-center lg:text-left">
                  <div className="flex justify-center lg:justify-start mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200/50 flex items-center justify-center">
                      <Mail className="w-7 h-7 text-indigo-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Reset Password
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Enter your registered email to receive a verification code.
                  </p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-slate-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        required
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all sm:text-sm"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Verification Code
                        <Send size={18} />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* STEP 2: OTP Verification */}
            {step === "otp" && (
              <motion.div
                key="step2"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="text-center lg:text-left">
                  <div className="flex justify-center lg:justify-start mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 flex items-center justify-center">
                      <Key className="w-7 h-7 text-blue-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Verify Code
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Enter the 6-digit code sent to{" "}
                    <span className="font-medium text-indigo-600">{email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3 text-center">
                      Verification Code
                    </label>
                    <div className="flex justify-center gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) =>
                            handleOTPChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOTPKeyDown(index, e)}
                          onPaste={index === 0 ? handleOTPPaste : undefined}
                          className="w-10 h-12 md:w-12 md:h-14 text-center text-2xl font-bold font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                        />
                      ))}
                    </div>
                    <div className="text-center mt-4">
                      {timer > 0 ? (
                        <p className="text-sm text-slate-500">
                          Resend available in{" "}
                          <span className="font-semibold text-indigo-600">
                            {timer}s
                          </span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          disabled={isLoading}
                          className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                        >
                          Resend Code
                        </button>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || otp.some((d) => !d)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="w-full text-sm text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    ← Change email address
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 3: New Password */}
            {step === "password" && (
              <motion.div
                key="step3"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="text-center lg:text-left">
                  <div className="flex justify-center lg:justify-start mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/50 flex items-center justify-center">
                      <Lock className="w-7 h-7 text-emerald-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Create New Password
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Choose a strong password for your account.
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-slate-400" />
                      </div>
                      <input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 8 characters"
                        required
                        className="block w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-slate-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                        className="block w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        Update Password
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* STEP 4: Success */}
            {step === "success" && (
              <motion.div
                key="success"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col items-center justify-center py-8 space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: 0.2,
                  }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>

                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Password Reset Successfully
                  </h2>
                  <p className="text-sm text-slate-500">
                    Your password has been updated. Redirecting to login...
                  </p>
                </div>

                <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-indigo-600 text-sm font-medium flex items-center justify-center gap-2">
                    <Sparkles size={16} />
                    Redirecting to login portal...
                  </p>
                </div>

                <Link
                  to="/login"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all"
                >
                  Return to Login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;
