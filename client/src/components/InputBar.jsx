import React, { useState, useRef, useEffect } from "react";
import { Paperclip, Send } from "lucide-react";

const InputBar = ({ onSend }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  useEffect(() => {
    const chatInput = inputRef.current;
    const inputContainer = containerRef.current;

    const handleFocus = () => {
      inputContainer.classList.add(
        "ring-2",
        "ring-primary/20",
        "border-primary/50",
      );
    };
    const handleBlur = () => {
      inputContainer.classList.remove(
        "ring-2",
        "ring-primary/20",
        "border-primary/50",
      );
    };

    chatInput.addEventListener("focus", handleFocus);
    chatInput.addEventListener("blur", handleBlur);

    return () => {
      chatInput.removeEventListener("focus", handleFocus);
      chatInput.removeEventListener("blur", handleBlur);
    };
  }, []);

  return (
    <div className="absolute bottom-0 left-0 w-full p-container-padding bg-gradient-to-t from-surface-bright via-surface-bright to-transparent pt-10 pointer-events-none">
      <form
        onSubmit={handleSubmit}
        className="max-w-chat-max-width mx-auto glass-card rounded-2xl p-2 flex items-center gap-2 pointer-events-auto shadow-xl"
        ref={containerRef}
      >
        <button
          type="button"
          className="p-3 rounded-xl hover:bg-surface-container transition-colors text-on-surface-variant flex items-center justify-center cursor-pointer"
          title="Upload data"
        >
          <Paperclip size={20} />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your dataset..."
          className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-body-md py-3 text-on-surface placeholder:text-on-surface-variant/60:text-slate-400/60 text-lg"
        />
        <button
          type="submit"
          className="bg-primary text-on-primary w-12 h-12 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all active:scale-90 group cursor-pointer"
        >
          <Send
            size={20}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </form>
      <p className="text-center text-[10px] text-on-surface-variant mt-3 opacity-60">
        Data Analyst Pro can make mistakes. Verify important results.
      </p>
    </div>
  );
};

export default InputBar;
