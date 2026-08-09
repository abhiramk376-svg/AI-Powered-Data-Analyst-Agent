// import React, { useState } from "react";
// import {
//   BarChart3,
//   Mail,
//   Lock,
//   User,
//   ArrowRight,
//   ShieldCheck,
//   Eye,
//   EyeOff,
//   ArrowLeft,
// } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import toast from "react-hot-toast";

// const Signup = () => {
//   const { signup } = useAuth();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }
//     try {
//       await signup(
//         formData.fullName,
//         formData.email,
//         formData.password,
//         formData.confirmPassword,
//       );
//       toast.success("Account created successfully! Redirecting...");
//       setTimeout(() => {
//         navigate("/chat");
//       }, 1500);
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   return (
//     <div className="min-h-screen flex font-body bg-slate-50 text-slate-900 selection:bg-indigo-100">
//       {/* LEFT PANEL - Branding (Hidden on mobile) */}
//       <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
//         {/* Back Button */}
//         <button
//           onClick={() => window.history.back()}
//           className="absolute top-8 left-8 z-20 flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 group"
//           aria-label="Go back"
//         >
//           <ArrowLeft
//             size={18}
//             className="group-hover:-translate-x-0.5 transition-transform"
//           />
//           <span className="text-sm font-medium">Back</span>
//         </button>

//         {/* Decorative background elements */}
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent"></div>
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>

//         <div className="relative z-10 max-w-lg">
//           <div className="flex items-center gap-2 text-white font-bold text-2xl tracking-tight mb-12">
//             <BarChart3 size={28} className="text-indigo-400" />
//             <span>DataAgent AI</span>
//           </div>

//           <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
//             Start chatting with your data today.
//           </h1>
//           <p className="text-lg text-slate-300 mb-10 leading-relaxed">
//             Join thousands of professionals using autonomous AI to generate
//             instant visualizations, forecasts, and actionable insights without
//             writing a single line of code.
//           </p>

//           <div className="flex items-center gap-4 text-slate-300 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
//             <ShieldCheck size={24} className="text-emerald-400 flex-shrink-0" />
//             <p className="text-sm">
//               Your datasets are analyzed in a highly secure, isolated sandbox
//               environment. We never train our models on your private data.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT PANEL - Signup Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
//         <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100 relative">
//           {/* Mobile Back Button */}
//           <button
//             onClick={() => window.history.back()}
//             className="lg:hidden flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors duration-200 mb-4"
//             aria-label="Go back"
//           >
//             <ArrowLeft size={16} />
//             <span className="text-sm">Back</span>
//           </button>

//           {/* Mobile Logo (Visible only on small screens) */}
//           <div className="flex lg:hidden items-center justify-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
//             <BarChart3 size={24} />
//             <span>DataAgent AI</span>
//           </div>

//           <div className="text-center lg:text-left">
//             <h2 className="text-3xl font-bold tracking-tight text-slate-900">
//               Create an account
//             </h2>
//             <p className="mt-2 text-sm text-slate-500">
//               Already have an account?{" "}
//               <Link
//                 to="/login"
//                 className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
//               >
//                 Sign in instead
//               </Link>
//             </p>
//           </div>

//           <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//             <div className="space-y-4">
//               {/* Full Name Field */}
//               <div>
//                 <label
//                   htmlFor="fullName"
//                   className="block text-sm font-medium text-slate-700 mb-1"
//                 >
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User size={18} className="text-slate-400" />
//                   </div>
//                   <input
//                     id="fullName"
//                     name="fullName"
//                     type="text"
//                     required
//                     className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all sm:text-sm"
//                     placeholder="John Doe"
//                     value={formData.fullName}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>

//               {/* Email Field */}
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-slate-700 mb-1"
//                 >
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Mail size={18} className="text-slate-400" />
//                   </div>
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     autoComplete="email"
//                     required
//                     className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all sm:text-sm"
//                     placeholder="you@company.com"
//                     value={formData.email}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-slate-700 mb-1"
//                 >
//                   Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock size={18} className="text-slate-400" />
//                   </div>
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     required
//                     className="block w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all sm:text-sm"
//                     placeholder="••••••••"
//                     value={formData.password}
//                     onChange={handleChange}
//                   />
//                   <button
//                     type="button"
//                     onClick={togglePasswordVisibility}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
//                     aria-label={
//                       showPassword ? "Hide password" : "Show password"
//                     }
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//               </div>

//               {/* Confirm Password Field */}
//               <div>
//                 <label
//                   htmlFor="confirmPassword"
//                   className="block text-sm font-medium text-slate-700 mb-1"
//                 >
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock size={18} className="text-slate-400" />
//                   </div>
//                   <input
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type={showConfirmPassword ? "text" : "password"}
//                     required
//                     className="block w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all sm:text-sm"
//                     placeholder="••••••••"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                   />
//                   <button
//                     type="button"
//                     onClick={toggleConfirmPasswordVisibility}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
//                     aria-label={
//                       showConfirmPassword ? "Hide password" : "Show password"
//                     }
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff size={18} />
//                     ) : (
//                       <Eye size={18} />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center">
//               <input
//                 id="terms"
//                 name="terms"
//                 type="checkbox"
//                 required
//                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-600 border-slate-300 rounded cursor-pointer"
//               />
//               <label
//                 htmlFor="terms"
//                 className="ml-2 block text-sm text-slate-600 cursor-pointer"
//               >
//                 I agree to the{" "}
//                 <a
//                   href="/terms"
//                   className="font-semibold text-indigo-600 hover:text-indigo-500:text-indigo-300"
//                 >
//                   Terms of Service
//                 </a>{" "}
//                 and{" "}
//                 <a
//                   href="/privacy"
//                   className="font-semibold text-indigo-600 hover:text-indigo-500:text-indigo-300"
//                 >
//                   Privacy Policy
//                 </a>
//                 .
//               </label>
//             </div>

//             <button
//               type="submit"
//               className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all active:scale-[0.98]"
//               onClick={handleSubmit}
//             >
//               Create Account
//               <ArrowRight size={18} />
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;
//updated code with framermotion animation

import React, { useState } from "react";
import {
  BarChart3,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await signup(
        formData.fullName,
        formData.email,
        formData.password,
        formData.confirmPassword,
      );
      toast.success("Account created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/chat");
      }, 1500);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Animation variants
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

  const leftPanelVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 30,
        delay: 0.1,
      },
    },
  };

  const rightPanelVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 30,
        delay: 0.2,
      },
    },
  };

  const formCardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: 0.3,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex font-body bg-slate-50 text-slate-900 selection:bg-indigo-100 overflow-hidden"
    >
      {/* LEFT PANEL - Branding (Hidden on mobile) */}
      <motion.div
        variants={leftPanelVariants}
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
            Start chatting with your data today.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-slate-300 mb-10 leading-relaxed"
          >
            Join thousands of professionals using autonomous AI to generate
            instant visualizations, forecasts, and actionable insights without
            writing a single line of code.
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
              Your datasets are analyzed in a highly secure, isolated sandbox
              environment. We never train our models on your private data.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* RIGHT PANEL - Signup Form */}
      <motion.div
        variants={rightPanelVariants}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12"
      >
        <motion.div
          variants={formCardVariants}
          whileHover={{ boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}
          className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100 relative"
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

          {/* Mobile Logo (Visible only on small screens) */}
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

          <motion.div
            variants={itemVariants}
            className="text-center lg:text-left"
          >
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold tracking-tight text-slate-900"
            >
              Create an account
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-2 text-sm text-slate-500"
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500:text-indigo-300 transition-colors"
              >
                Sign in instead
              </Link>
            </motion.p>
          </motion.div>

          <motion.form
            variants={containerVariants}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              {/* Full Name Field */}
              <motion.div variants={itemVariants}>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Full Name
                  </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-400" />
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all sm:text-sm"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div variants={itemVariants}>
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
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all sm:text-sm"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Password
                  </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all sm:text-sm"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </motion.button>
                </div>
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div variants={itemVariants}>
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
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="block w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all sm:text-sm"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-600 border-slate-300 rounded cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-slate-600 cursor-pointer"
              >
                I agree to the{" "}
                <a
                  href="/terms"
                  className="font-semibold text-indigo-600 hover:text-indigo-500:text-indigo-300"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="font-semibold text-indigo-600 hover:text-indigo-500:text-indigo-300"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </motion.div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700:bg-indigo-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all active:scale-[0.98]"
                onClick={handleSubmit}
              >
              Create Account
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={18} />
              </motion.div>
            </motion.button>
          </motion.form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Signup;
