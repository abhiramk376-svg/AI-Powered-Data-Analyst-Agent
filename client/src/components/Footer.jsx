import {
  BarChart3,
  Github,
  BookOpen,
  Sparkles,
  Mail,
  Twitter,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const navigation = {
    product: [
      { name: "Features", href: "#features" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "Documentation", href: "#docs", icon: BookOpen },
    ],
  };

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
                <BarChart3 size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                DataAgent AI
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-w-md">
              An autonomous, conversational AI system designed to perform
              end‑to‑end data analysis. Upload your datasets and get instant
              visualizations, forecasts, and actionable insights without writing
              a single line of code.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-50:bg-slate-700 text-slate-600 hover:text-indigo-600:text-indigo-400 transition-all duration-200 group"
                aria-label="GitHub"
              >
                <Github
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-50:bg-slate-700 text-slate-600 hover:text-indigo-600:text-indigo-400 transition-all duration-200 group"
                aria-label="Documentation"
              >
                <BookOpen
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm text-slate-600 hover:text-indigo-600:text-indigo-400 transition-colors duration-200 hover:underline underline-offset-2"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Sparkles size={14} className="text-indigo-400" />
              <span>Powered by AI</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-slate-200" />
            <a
              href="#"
              className="text-sm text-slate-500 hover:text-indigo-600:text-indigo-400 transition-colors duration-200 flex items-center gap-1.5"
            >
              <Github size={14} />
              <span>Star on GitHub</span>
            </a>
            <a
              href="#"
              className="text-sm text-slate-500 hover:text-indigo-600:text-indigo-400 transition-colors duration-200 flex items-center gap-1.5"
            >
              <BookOpen size={14} />
              <span>Documentation</span>
            </a>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} DataAgent Platform. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export { Footer as default };
