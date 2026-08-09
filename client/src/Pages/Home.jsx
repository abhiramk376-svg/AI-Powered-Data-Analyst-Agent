import React from "react";
import {
  BarChart3,
  BrainCircuit,
  MessageSquare,
  UploadCloud,
  Zap,
  LineChart,
  ArrowRight,
  Shield,
  Sparkles,
  ChevronRight,
  Database,
  Clock,
  Users,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import { motion } from "framer-motion";

const Home = () => {
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const scaleOnHover = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 400, damping: 25 },
  };

  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const pulseAnimation = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.3, 0.5, 0.3],
    },
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 font-body text-slate-900 selection:bg-indigo-100"
    >
      {/* Navigation */}
      <motion.nav
        variants={itemVariants}
        className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5 text-indigo-600 font-bold text-xl tracking-tight"
          >
            <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg shadow-indigo-500/25">
              <BarChart3 size={20} className="text-white" />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              DataAgent AI
            </span>
          </motion.div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            {["Features", "How it Works", "About"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="hover:text-indigo-600:text-indigo-400 transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
            >
              <Link to="/login">Launch App</Link>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <main>
        {/* HERO SECTION */}
        <motion.section
          variants={containerVariants}
          className="relative pt-20 pb-28 md:pt-32 md:pb-40 overflow-hidden"
        >
          {/* Background decorations */}
          <motion.div
            {...pulseAnimation}
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-3xl -z-10"
          />
          <motion.div
            {...pulseAnimation}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-200/20 rounded-full blur-3xl -z-10"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent -z-10"></div>

          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center relative">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-indigo-100/80 border border-indigo-200/50 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm"
            >
              <Zap size={14} className="text-indigo-500" />
              <span>Next-Gen Autonomous Analytics</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-[1.1] mb-6"
            >
              Transform your data into
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 block mt-2">
                intelligent conversations
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed"
            >
              An autonomous, conversational AI system designed to perform
              end‑to‑end data analysis. Upload your datasets and get instant
              visualizations, forecasts, and actionable insights without writing
              a single line of code.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 w-full justify-center"
            >
              <motion.button
                {...scaleOnHover}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all"
              >
                <Link to="/login" className="flex items-center gap-2">
                  Start Analyzing
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </motion.button>
              <motion.a
                {...scaleOnHover}
                href="#features"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-lg border border-slate-300 bg-white/80 backdrop-blur-sm hover:bg-white:bg-slate-700 hover:border-indigo-300:border-indigo-500 text-slate-900 transition-all"
              >
                Explore Features
                <ChevronRight size={18} />
              </motion.a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
            >
              <div className="flex items-center gap-2">
                <Award size={16} className="text-indigo-500" />
                <span>Enterprise Grade</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-300" />
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-emerald-500" />
                <span>GDPR Compliant</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-300" />
            </motion.div>
          </div>
        </motion.section>

        {/* FEATURES SECTION */}
        <motion.section
          id="features"
          variants={containerVariants}
          className="py-24 bg-white relative"
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div variants={itemVariants} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles size={14} />
                <span>Core Capabilities</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Powerful Autonomous Analytics
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Everything you need to turn raw CSV and Excel files into
                presentation-ready insights in seconds.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <BrainCircuit size={28} className="text-indigo-600" />,
                  title: "Iterative Reasoning",
                  desc: "Powered by LangGraph, the agent uses multi-step logic to clean, process, and analyze complex datasets accurately.",
                  color: "from-indigo-50 to-indigo-100/50",
                  iconBg: "bg-indigo-100",
                },
                {
                  icon: <LineChart size={28} className="text-violet-600" />,
                  title: "Instant Visualizations",
                  desc: "Automatically generates dynamic charts using matplotlib and seaborn. Ask to 'Zoom into Q3' or 'Try a bar chart instead'.",
                  color: "from-violet-50 to-violet-100/50",
                  iconBg: "bg-violet-100",
                },
                {
                  icon: <Shield size={28} className="text-emerald-600" />,
                  title: "Secure Execution",
                  desc: "Safely executes Python code in a controlled, isolated sandbox environment to ensure your data remains protected.",
                  color: "from-emerald-50 to-emerald-100/50",
                  iconBg: "bg-emerald-100",
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`p-8 rounded-2xl bg-gradient-to-br ${feature.color} border border-slate-100 hover:border-indigo-200:border-indigo-500 hover:shadow-lg:shadow-indigo-900/20 transition-all group`}
                >
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className={`w-14 h-14 rounded-xl ${feature.iconBg} shadow-sm flex items-center justify-center mb-6 transition-transform`}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* HOW IT WORKS */}
        <motion.section
          id="how-it-works"
          variants={containerVariants}
          className="py-24 bg-slate-900 text-white relative overflow-hidden"
        >
          <motion.div
            {...pulseAnimation}
            className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl"
          />
          <motion.div
            {...pulseAnimation}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-3xl"
          />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div variants={itemVariants} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Clock size={14} />
                <span>Simple Workflow</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                From Raw Data to Insights in 3 Steps
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                No complex configurations. Just natural language and instant
                results.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-[2px] bg-gradient-to-r from-transparent via-slate-700 to-transparent z-0" />

              {[
                {
                  step: "01",
                  icon: <UploadCloud size={32} />,
                  title: "Upload Dataset",
                  desc: "Drop in your CSV or Excel files. The agent automatically parses the schema, identifies data types, and prepares the environment.",
                },
                {
                  step: "02",
                  icon: <MessageSquare size={32} />,
                  title: "Ask a Question",
                  desc: "Query your data naturally. 'What are the trends in sales?' or 'Forecast next quarter's revenue based on historical data.'",
                },
                {
                  step: "03",
                  icon: <BarChart3 size={32} />,
                  title: "Explore Results",
                  desc: "Review the generated narrative, statistical summaries, and visual charts. Refine results conversationally to dig deeper.",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="relative z-10 flex flex-col items-center text-center"
                >
                  <motion.div
                    {...floatingAnimation}
                    transition={{
                      duration: 3,
                      delay: idx * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-slate-700 flex items-center justify-center text-indigo-400 mb-6 shadow-xl"
                  >
                    {item.icon}
                  </motion.div>
                  <div className="text-indigo-400 font-mono text-sm font-bold mb-2 tracking-wider">
                    STEP {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed max-w-xs">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ABOUT SECTION - Refined and kept */}
        <motion.section
          id="about"
          variants={containerVariants}
          className="py-24 bg-gradient-to-b from-indigo-50/50 to-white"
        >
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles size={14} />
                <span>About the Platform</span>
              </div>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-6"
            >
              Built for the Future of Data Analysis
            </motion.h2>
            <motion.div
              variants={itemVariants}
              whileHover={{ boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}
              className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-indigo-100/50 text-left space-y-6 transition-all"
            >
                            <p className="text-lg text-slate-700 leading-relaxed">
                Built on a robust foundation of {" "}
                <strong className="text-indigo-600">FastAPI</strong> and{" "}
                <strong className="text-indigo-600">LangGraph</strong>, this
                platform redefines how teams interact with their data. By
                abstracting away the complexities of Python libraries like{" "}
                <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">
                  pandas
                </code>
                ,{" "}
                <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">
                  numpy
                </code>
                , and{" "}
                <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">
                  scikit-learn
                </code>
                , it empowers non-technical users to perform advanced analytics.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                The architecture relies on sophisticated tool-calling and
                session-level memory, enabling multi-step analytical workflows
                that feel as natural as talking to a human data scientist.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm rounded-full font-medium">
                  🚀 Enterprise-ready
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-sm rounded-full font-medium">
                  🔒 SOC-2 Compliant
                </span>
                <span className="px-3 py-1 bg-violet-50 text-violet-600 text-sm rounded-full font-medium">
                  ⚡ Real-time Processing
                </span>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA SECTION - Added for professional finish */}
        <motion.section
          variants={containerVariants}
          className="py-20 bg-gradient-to-r from-indigo-600 to-indigo-500 relative overflow-hidden"
        >
          <motion.div
            {...pulseAnimation}
            className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl"
          />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Ready to transform your data analysis?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto"
            >
              Join thousands of teams already using DataAgent AI to unlock the
              full potential of their data.
            </motion.p>
            <motion.button
              {...scaleOnHover}
              className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Link to="/signup" className="flex items-center gap-2">
                Get Started Free
                <ArrowRight size={20} />
              </Link>
            </motion.button>
          </div>
        </motion.section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Home;
