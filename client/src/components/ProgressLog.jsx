import React, { useRef, useEffect } from "react";
import {
  BrainCircuit,
  Code,
  Play,
  CheckCircle,
  XCircle,
  BarChart3,
  FileText,
  Loader2,
} from "lucide-react";

const STEP_CONFIG = {
  analyst_started: {
    icon: BrainCircuit,
    label: "Analyst reasoning",
    color: "text-indigo-500",
    bg: "bg-indigo-100",
  },
  code_generated: {
    icon: Code,
    label: "Code generated",
    color: "text-violet-500",
    bg: "bg-violet-100",
  },
  code_executing: {
    icon: Play,
    label: "Executing code",
    color: "text-amber-500",
    bg: "bg-amber-100",
  },
  code_result: {
    icon: CheckCircle,
    label: "Code result",
    color: "text-emerald-500",
    bg: "bg-emerald-100",
  },
  code_error: {
    icon: XCircle,
    label: "Code error",
    color: "text-rose-500",
    bg: "bg-rose-100",
  },
  synthesizer_started: {
    icon: FileText,
    label: "Generating insights",
    color: "text-sky-500",
    bg: "bg-sky-100",
  },
};

const ProgressLog = ({ steps, isActive }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [steps]);

  if (steps.length === 0 && !isActive) return null;

  return (
    <div className="w-full max-w-chat-max-width mx-auto mb-4">
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Loader2
            size={14}
            className={`text-primary ${isActive ? "animate-spin" : "opacity-0"}`}
          />
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Analysis Progress
          </span>
        </div>

        <div className="space-y-2">
          {steps.map((step, idx) => {
            const config =
              STEP_CONFIG[step.type] || STEP_CONFIG.analyst_started;
            const Icon = config.icon;
            const isLast = idx === steps.length - 1;
            const isError = step.type === "code_result" && step.error;

            return (
              <div key={idx} className="flex gap-3">
                <div className="flex flex-col items-center gap-0.5">
                  <div
                    className={`w-7 h-7 rounded-full ${isError ? "bg-rose-100" : config.bg} flex items-center justify-center flex-shrink-0 ${isLast && isActive ? "ring-2 ring-primary/30" : ""}`}
                  >
                    {isLast && isActive && step.type === "code_executing" ? (
                      <Loader2
                        size={12}
                        className="animate-spin text-amber-500"
                      />
                    ) : (
                      <Icon
                        size={12}
                        className={isError ? "text-rose-500" : config.color}
                      />
                    )}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-px flex-1 bg-outline-variant/50 min-h-[8px]" />
                  )}
                </div>

                <div className="pb-2 flex-1 min-w-0">
                  <span className="text-xs font-medium text-on-surface block leading-relaxed">
                    {isError ? "Code error" : config.label}
                    {step.iteration && (
                      <span className="text-on-surface-variant ml-1">
                        (iteration {step.iteration})
                      </span>
                    )}
                  </span>

                  {step.type === "code_generated" && step.code && (
                    <div className="mt-1 bg-slate-950 rounded-lg overflow-hidden">
                      <pre className="text-[10px] text-slate-200 p-2 overflow-x-auto max-h-20 custom-scrollbar font-mono leading-relaxed">
                        {step.code.length > 300
                          ? step.code.slice(0, 300) + "..."
                          : step.code}
                      </pre>
                    </div>
                  )}

                  {step.type === "code_result" && (
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block">
                      {isError
                        ? step.error.length > 100
                          ? step.error.slice(0, 100) + "..."
                          : step.error
                        : step.result
                          ? "Completed successfully"
                          : "No result returned"}
                    </span>
                  )}

                  {step.type === "chart" && (
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block">
                      {step.filename}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {isActive && (
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 size={12} className="animate-spin text-primary" />
                </div>
              </div>
              <div className="pb-2">
                <span className="text-xs text-on-surface-variant">
                  Processing...
                </span>
              </div>
            </div>
          )}
        </div>

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ProgressLog;
