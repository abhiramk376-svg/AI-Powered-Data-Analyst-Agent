// import React, { useState } from "react";
// import {
//   BarChart3,
//   Mail,
//   Lock,
//   ArrowRight,
//   ShieldCheck,
//   Eye,
//   EyeOff,
//   ArrowLeft,
// } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import toast from "react-hot-toast";

// const Login = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     rememberMe: false,
//   });
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await login(formData.email, formData.password);
//       toast.success("Welcome back! Redirecting to chat...");
//       setTimeout(() => {
//         navigate("/chat");
//       }, 2500);
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
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
//             Welcome back to your data partner.
//           </h1>
//           <p className="text-lg text-slate-300 mb-10 leading-relaxed">
//             Log in to continue transforming your CSV and Excel datasets into
//             interactive visualizations, summaries, and forecasting structures.
//           </p>

//           <div className="flex items-center gap-4 text-slate-300 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
//             <ShieldCheck size={24} className="text-emerald-400 flex-shrink-0" />
//             <p className="text-sm">
//               Session computations remain fully sandbox-isolated. Security
//               updates run continuously to safeguard your operations.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT PANEL - Login Form */}
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
//               Sign in
//             </h2>
//             <p className="mt-2 text-sm text-slate-500">
//               New to the platform?{" "}
//               <Link
//                 to="/signup"
//                 className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
//               >
//                 Create an account
//               </Link>
//             </p>
//           </div>

//           <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//             <div className="space-y-4">
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
//                 <div className="flex items-center justify-between mb-1">
//                   <label
//                     htmlFor="password"
//                     className="block text-sm font-medium text-slate-700"
//                   >
//                     Password
//                   </label>
//                   <a
//                     href="/forgot-password"
//                     className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
//                   >
//                     Forgot password?
//                   </a>
//                 </div>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock size={18} className="text-slate-400" />
//                   </div>
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     autoComplete="current-password"
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
//             </div>

//             {/* Remember Me Checkbox */}
//             <div className="flex items-center">
//               <input
//                 id="rememberMe"
//                 name="rememberMe"
//                 type="checkbox"
//                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-600 border-slate-300 rounded cursor-pointer"
//                 checked={formData.rememberMe}
//                 onChange={handleChange}
//               />
//               <label
//                 htmlFor="rememberMe"
//                 className="ml-2 block text-sm text-slate-600 cursor-pointer select-none"
//               >
//                 Remember this device
//               </label>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all active:scale-[0.98]"
//               onClick={handleSubmit}
//             >
//               Sign In
//               <ArrowRight size={18} />
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

//updated with framer motion animation

import React, { useState } from "react";
import {
  BarChart3,
  Mail,
  Lock,
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

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      toast.success("Welcome back! Redirecting to chat...");
      setTimeout(() => {
        navigate("/chat");
      }, 2500);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            Welcome back to your data partner.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-slate-300 mb-10 leading-relaxed"
          >
            Log in to continue transforming your CSV and Excel datasets into
            interactive visualizations, summaries, and forecasting structures.
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
              Session computations remain fully sandbox-isolated. Security
              updates run continuously to safeguard your operations.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* RIGHT PANEL - Login Form */}
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
              Sign in
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-2 text-sm text-slate-500"
            >
              New to the platform?{" "}
              <Link
                to="/signup"
                className="font-semibold text-indigo-600 hover:text-indigo-500:text-indigo-300 transition-colors"
              >
                Create an account
              </Link>
            </motion.p>
          </motion.div>

          <motion.form
            variants={containerVariants}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
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
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
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
            </div>

            {/* Remember Me Checkbox */}
            <motion.div variants={itemVariants} className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-600 border-slate-300 rounded cursor-pointer"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-slate-600 cursor-pointer select-none"
              >
                Remember this device
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700:bg-indigo-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all active:scale-[0.98]"
              onClick={handleSubmit}
            >
              Sign In
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

export default Login;
