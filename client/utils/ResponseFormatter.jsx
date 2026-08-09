import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ResponseFormatter = ({ content, isUser }) => {
  // Custom Tailwind styling map for specific Markdown elements
  const components = {
    // Headings
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold tracking-tight text-on-surface mt-4 mb-2 font-body">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-bold tracking-tight text-on-surface mt-4 mb-2 font-body">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-semibold tracking-tight text-on-surface-variant mt-3 mb-1 font-body">
        {children}
      </h3>
    ),

    // Bold & Emphasis
    strong: ({ children }) => (
      <strong className="font-bold text-primary dark:text-primary-fixed-dim">
        {children}
      </strong>
    ),
    em: ({ children }) => <em className="italic opacity-90">{children}</em>,

    // Lists
    ul: ({ children }) => (
      <ul className="list-disc pl-6 my-3 space-y-1 text-lg">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-6 my-3 space-y-1 text-lg">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,

    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary bg-surface-container/50 dark:bg-surface-container-high/40 px-4 py-3 my-4 rounded-r-lg font-body italic text-on-surface-variant">
        {children}
      </blockquote>
    ),

    // Tables
    table: ({ children }) => (
      <div className="w-full overflow-x-auto my-4 rounded-xl border border-outline-variant dark:border-outline shadow-sm">
        <table className="w-full text-left border-collapse text-sm md:text-base">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-surface-container-low dark:bg-surface-container text-on-surface font-semibold">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-outline-variant dark:divide-outline">
        {children}
      </tbody>
    ),
    th: ({ children }) => (
      <th className="p-4 font-semibold border-b border-outline-variant">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="p-4 text-on-surface-variant leading-normal">{children}</td>
    ),

    // Code Blocks & Inline Code
    code: ({ node, inline, className, children, ...props }) => {
      return inline ? (
        <code
          className="bg-surface-container-high dark:bg-surface-container text-primary font-mono text-sm px-1.5 py-0.5 rounded border border-outline-variant"
          {...props}
        >
          {children}
        </code>
      ) : (
        <pre className="bg-slate-950 text-slate-100 p-4 rounded-xl overflow-x-auto my-4 font-mono text-sm border border-slate-800 shadow-inner">
          <code {...props}>{children}</code>
        </pre>
      );
    },

    // Paragraph layout baseline
    p: ({ children }) => (
      <p className="mb-3 last:mb-0 leading-relaxed text-lg font-body">
        {children}
      </p>
    ),
  };

  return (
    <div
      className={`markdown-renderer ${isUser ? "text-on-primary" : "text-on-surface"}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default ResponseFormatter;
