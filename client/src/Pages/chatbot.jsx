// import React, { useState, useRef, useEffect, useCallback } from "react";
// import {
//   User,
//   Bot,
//   Download,
//   Maximize2,
//   UploadCloud,
//   Send,
//   Loader2,
// } from "lucide-react";
// import Sidebar from "../components/Sidebar";

// const API_BASE = "";

// const MessageBubble = ({ message }) => {
//   const isUser = message.role === "user";

//   return (
//     <div
//       className={`flex items-start gap-4 ${
//         isUser ? "justify-end" : "justify-start"
//       }`}
//     >
//       {!isUser && (
//         <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-md">
//           <Bot size={16} className="text-white" fill="white" />
//         </div>
//       )}

//       <div
//         className={`max-w-[80%] ${isUser ? "max-w-[80%]" : "max-w-[90%]"} space-y-4`}
//       >
//         <div
//           className={`p-6 rounded-2xl shadow-sm border ${
//             isUser
//               ? "bg-primary-container text-on-primary rounded-tr-none"
//               : "bg-surface-container-low text-on-surface rounded-tl-none border-outline-variant"
//           }`}
//         >
//           <p className="font-body text-lg leading-relaxed whitespace-pre-wrap">
//             {message.content}
//           </p>
//         </div>
//       </div>

//       {isUser && (
//         <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center flex-shrink-0">
//           <User size={16} className="text-primary" />
//         </div>
//       )}
//     </div>
//   );
// };

// const ChartCard = ({ title, legendLabel, imageSrc, imageAlt }) => {
//   return (
//     <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
//       <div className="flex items-center justify-between mb-4">
//         <h4 className="font-body text-lg uppercase tracking-tight text-on-surface-variant font-semibold">
//           {title}
//         </h4>
//         <div className="flex gap-2 items-center">
//           <span className="w-3 h-3 rounded-full bg-primary"></span>
//           <span className="text-[10px] text-on-surface-variant font-bold">
//             {legendLabel}
//           </span>
//         </div>
//       </div>
//       <div className="w-full aspect-[16/9] rounded-lg overflow-hidden bg-slate-50 relative group">
//         <img
//           src={imageSrc}
//           alt={imageAlt}
//           className="w-full h-full object-cover transition-transform duration-500"
//         />
//       </div>
//     </div>
//   );
// };

// const ArtifactHeader = ({ chartCount }) => {
//   return (
//     <div className="flex items-center px-4 border-b border-outline-variant h-14 shrink-0 bg-surface-container-low">
//       <div className="flex gap-4">
//         <span className="px-4 py-4 text-lg font-semibold -mb-[1px] transition-colors cursor-default text-primary border-b-2 border-primary">
//           Visualizations ({chartCount})
//         </span>
//       </div>
//       <div className="ml-auto flex items-center gap-2">
//         <button className="p-2 text-on-surface-variant hover:bg-surface-container transition-colors rounded-lg cursor-pointer">
//           <Download size={16} />
//         </button>
//         <button className="p-2 text-on-surface-variant hover:bg-surface-container transition-colors rounded-lg cursor-pointer">
//           <Maximize2 size={16} />
//         </button>
//       </div>
//     </div>
//   );
// };

// const LoadingIndicator = () => (
//   <div className="flex items-start gap-4 justify-start">
//     <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-md">
//       <Bot size={16} className="text-white" fill="white" />
//     </div>
//     <div className="p-6 rounded-2xl shadow-sm border bg-surface-container-low text-on-surface rounded-tl-none border-outline-variant">
//       <div className="flex items-center gap-3">
//         <Loader2 size={24} className="animate-spin text-primary" />
//         <span className="text-lg text-on-surface-variant">
//           Analyzing dataset...
//         </span>
//       </div>
//     </div>
//   </div>
// );

// const InputBarInline = ({ onSend, disabled = false }) => {
//   const [input, setInput] = useState("");
//   const inputRef = useRef(null);
//   const containerRef = useRef(null);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (input.trim()) {
//       onSend(input.trim());
//       setInput("");
//     }
//   };

//   useEffect(() => {
//     const chatInput = inputRef.current;
//     const inputContainer = containerRef.current;

//     if (!chatInput || !inputContainer) return;

//     const handleFocus = () => {
//       inputContainer.classList.add(
//         "ring-2",
//         "ring-primary/20",
//         "border-primary/50",
//       );
//     };
//     const handleBlur = () => {
//       inputContainer.classList.remove(
//         "ring-2",
//         "ring-primary/20",
//         "border-primary/50",
//       );
//     };

//     chatInput.addEventListener("focus", handleFocus);
//     chatInput.addEventListener("blur", handleBlur);

//     return () => {
//       chatInput.removeEventListener("focus", handleFocus);
//       chatInput.removeEventListener("blur", handleBlur);
//     };
//   }, []);

//   return (
//     <div className="absolute bottom-0 left-0 w-full p-container-padding bg-gradient-to-t from-surface-bright via-surface-bright to-transparent pt-10 pointer-events-none">
//       <form
//         onSubmit={handleSubmit}
//         className="max-w-chat-max-width mx-auto glass-card rounded-2xl p-2 flex items-center gap-2 pointer-events-auto shadow-xl"
//         ref={containerRef}
//       >
//         <input
//           ref={inputRef}
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Ask a question about your dataset..."
//           disabled={disabled}
//           className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-lg py-4 text-on-surface placeholder:text-on-surface-variant/60"
//         />
//         <button
//           type="submit"
//           disabled={disabled}
//           className="bg-primary text-on-primary w-14 h-14 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all active:scale-90 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <Send
//             size={24}
//             className="group-hover:translate-x-0.5 transition-transform"
//           />
//         </button>
//       </form>
//       <p className="text-center text-[10px] text-on-surface-variant mt-3 opacity-60">
//         Data Analyst Pro can make mistakes. Verify important results.
//       </p>
//     </div>
//   );
// };

// const ChatbotPage = () => {
//   const [messages, setMessages] = useState([
//     {
//       role: "agent",
//       content:
//         "Hello! I am your Data Analyst Agent. To get started, please upload your CSV or Excel dataset so I can analyze it.",
//     },
//   ]);

//   const [sessionId, setSessionId] = useState(null);
//   const [charts, setCharts] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [uploadedFile, setUploadedFile] = useState(null);

//   const chatContainerRef = useRef(null);
//   const bottomRef = useRef(null);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     if (bottomRef.current) {
//       bottomRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages, isLoading]);

//   const handleNewAnalysis = useCallback(async () => {
//     if (sessionId) {
//       try {
//         await fetch(`${API_BASE}/api/session/${sessionId}`, {
//           method: "DELETE",
//         });
//       } catch {}
//     }
//     setSessionId(null);
//     setCharts([]);
//     setIsLoading(false);
//     setUploadedFile(null);
//     setMessages([
//       {
//         role: "agent",
//         content:
//           "Hello! I am your Data Analyst Agent. To get started, please upload your CSV or Excel dataset so I can analyze it.",
//       },
//     ]);
//   }, [sessionId]);

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploadedFile(file.name);
//     setMessages((prev) => [
//       ...prev,
//       { role: "user", content: `Uploaded dataset: ${file.name}` },
//     ]);
//     setIsLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await fetch(`${API_BASE}/api/upload`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(errText || `Upload failed (${res.status})`);
//       }

//       const data = await res.json();
//       setSessionId(data.session_id);

//       setMessages((prev) => [
//         ...prev,
//         { role: "agent", content: data.message },
//       ]);
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "agent",
//           content: `**Upload error:** ${err.message}. Please try again.`,
//         },
//       ]);
//       setUploadedFile(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSendMessage = async (text) => {
//     if (!text.trim() || !sessionId) return;

//     const userMsg = { role: "user", content: text };
//     setMessages((prev) => [...prev, userMsg]);
//     setIsLoading(true);

//     try {
//       const res = await fetch(`${API_BASE}/api/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ session_id: sessionId, message: text }),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(errText || `Chat failed (${res.status})`);
//       }

//       const data = await res.json();

//       setMessages((prev) => [...prev, { role: "agent", content: data.answer }]);

//       if (data.charts && data.charts.length > 0) {
//         setCharts(data.charts);
//       }
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "agent",
//           content: `**Error:** ${err.message}. Please try again.`,
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="bg-surface text-on-surface h-screen flex overflow-hidden font-body">
//       <Sidebar
//         onNewAnalysis={handleNewAnalysis}
//         sessionId={sessionId}
//         messages={messages}
//       />

//       <div className="flex-1 flex overflow-hidden h-full">
//         <main className="flex-1 flex flex-col h-full bg-surface-bright relative border-r border-outline-variant">
//           <section
//             ref={chatContainerRef}
//             className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-32 bg-surface-bright/70"
//           >
//             <div className="max-w-chat-max-width mx-auto space-y-8">
//               {messages.map((msg, index) => (
//                 <MessageBubble key={index} message={msg} />
//               ))}

//               {isLoading && <LoadingIndicator />}

//               {!uploadedFile && !isLoading && (
//                 <div className="flex justify-center mt-6">
//                   <input
//                     type="file"
//                     accept=".csv, .xlsx, .xls"
//                     className="hidden"
//                     ref={fileInputRef}
//                     onChange={handleFileUpload}
//                   />
//                   <button
//                     onClick={() => fileInputRef.current.click()}
//                     className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-semibold hover:bg-primary/90 transition shadow-sm"
//                   >
//                     <UploadCloud size={20} />
//                     Upload Dataset
//                   </button>
//                 </div>
//               )}

//               <div ref={bottomRef} id="anchor-bottom" />
//             </div>
//           </section>

//           <div
//             className={`${!uploadedFile ? "opacity-50 pointer-events-none" : ""}`}
//           >
//             <InputBarInline
//               onSend={handleSendMessage}
//               disabled={!uploadedFile || isLoading}
//             />
//           </div>
//         </main>

//         {charts.length > 0 && (
//           <aside className="w-[450px] lg:w-[550px] flex flex-col bg-surface-container-lowest h-full border-l border-outline-variant overflow-hidden animate-in slide-in-from-right-8 duration-300">
//             <ArtifactHeader chartCount={charts.length} />

//             <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
//               {charts.map((chartName, idx) => (
//                 <ChartCard
//                   key={idx}
//                   title={`Chart ${idx + 1}`}
//                   legendLabel="DATA VISUALIZATION"
//                   imageSrc={`${API_BASE}/api/charts/${sessionId}/${chartName}`}
//                   imageAlt={`Data visualization chart ${idx + 1}`}
//                 />
//               ))}
//             </div>
//           </aside>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatbotPage;

//new with downloading image and viewing image in modal
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  User,
  Bot,
  Download,
  Maximize2,
  Minimize2,
  UploadCloud,
  Send,
  Loader2,
  X,
  ZoomIn,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import ProgressLog from "../components/ProgressLog";
import ResponseFormatter from "../../utils/ResponseFormatter";
import { useAuth } from "../context/AuthContext";

const API_BASE = "";

// Helper utility to download images cleanly via fetch blob extraction
const downloadImageFile = async (
  imageUrl,
  defaultFileName = "visualization.png",
) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = blobUrl;
    downloadLink.download = defaultFileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("Could not download image:", err);
  }
};

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`w-full flex items-start gap-4 ${
        isUser ? "justify-end pl-16 md:pl-24" : "justify-start pr-16 md:pr-24"
      }`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-md">
          <Bot size={16} className="text-white" fill="white" />
        </div>
      )}

      <div className={`max-w-full ${isUser ? "w-auto" : "w-full"} space-y-4`}>
        <div
          className={`p-6 rounded-2xl shadow-sm border ${
            isUser
              ? "bg-primary-container text-on-primary rounded-tr-none"
              : "bg-surface-container-low text-on-surface rounded-tl-none border-outline-variant"
          }`}
        >
          <div className="font-body text-lg leading-relaxed whitespace-pre-wrap">
            <ResponseFormatter content={message.content} isUser={isUser} />
          </div>
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center flex-shrink-0">
          <User size={16} className="text-primary" />
        </div>
      )}
    </div>
  );
};

const ChartCard = ({
  title,
  legendLabel,
  imageSrc,
  imageAlt,
  onZoom,
  onDownload,
}) => {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm group relative">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-body text-lg uppercase tracking-tight text-on-surface-variant font-semibold">
          {title}
        </h4>
        <div className="flex gap-4 items-center">
          <button
            onClick={onDownload}
            className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-md hover:bg-surface-container-low"
            title="Download Chart"
          >
            <Download size={16} />
          </button>
          <div className="flex gap-2 items-center">
            <span className="w-3 h-3 rounded-full bg-primary"></span>
            <span className="text-[10px] text-on-surface-variant font-bold">
              {legendLabel}
            </span>
          </div>
        </div>
      </div>
      <div
        onClick={onZoom}
        className="w-full aspect-[16/9] rounded-lg overflow-hidden bg-slate-50 relative cursor-pointer group/img"
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
        />
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-surface/90 text-on-surface p-3 rounded-full shadow-lg flex items-center gap-2 font-semibold text-sm">
            <ZoomIn size={18} />
            <span>Click to expand</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArtifactHeader = ({
  chartCount,
  isMaximized,
  onToggleMaximize,
  onDownloadAll,
}) => {
  return (
    <div className="flex items-center px-4 border-b border-outline-variant h-14 shrink-0 bg-surface-container-low">
      <div className="flex gap-4">
        <span className="px-4 py-4 text-lg font-semibold -mb-[1px] transition-colors cursor-default text-primary border-b-2 border-primary">
          Visualizations ({chartCount})
        </span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onDownloadAll}
          className="p-2 text-on-surface-variant hover:bg-surface-container transition-colors rounded-lg cursor-pointer"
          title="Download all generated charts"
        >
          <Download size={16} />
        </button>
        <button
          onClick={onToggleMaximize}
          className="p-2 text-on-surface-variant hover:bg-surface-container transition-colors rounded-lg cursor-pointer"
          title={
            isMaximized ? "Exit full view" : "Expand visualization workspace"
          }
        >
          {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
    </div>
  );
};

const LoadingIndicator = () => (
  <div className="flex items-start gap-4 justify-start pr-16 md:pr-24">
    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-md">
      <Bot size={16} className="text-white" fill="white" />
    </div>
    <div className="p-6 rounded-2xl shadow-sm border bg-surface-container-low text-on-surface rounded-tl-none border-outline-variant">
      <div className="flex items-center gap-3">
        <Loader2 size={24} className="animate-spin text-primary" />
        <span className="text-lg text-on-surface-variant">
          Analyzing dataset...
        </span>
      </div>
    </div>
  </div>
);

const ImageModal = ({ src, title, onClose, onDownload }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-5xl bg-surface rounded-2xl overflow-hidden shadow-2xl border border-outline-variant flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-outline-variant bg-surface-container-low">
          <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="p-2 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <Download size={18} />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-slate-900 flex items-center justify-center p-6">
          <img
            src={src}
            alt={title}
            className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

const InputBarInline = ({ onSend, disabled = false }) => {
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

    if (!chatInput || !inputContainer) return;

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
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your dataset..."
          disabled={disabled}
          className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-lg py-4 text-on-surface placeholder:text-on-surface-variant/60:text-slate-400/60"
        />
        <button
          type="submit"
          disabled={disabled}
          className="bg-primary text-on-primary w-14 h-14 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all active:scale-90 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send
            size={24}
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

const ChatbotPage = () => {
  const { user } = useAuth();
  const firstName = user?.fullName?.trim().split(/\s+/)[0] || "there";

  const buildWelcomeMessage = () =>
    `Hello ${firstName}, I am your Data Analyst Agent. To get started, please upload your CSV or Excel dataset so I can analyze it.`;

  const [messages, setMessages] = useState([
    {
      role: "agent",
      content: buildWelcomeMessage(),
    },
  ]);

  const [sessionId, setSessionId] = useState(null);
  const [charts, setCharts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Streaming progress
  const [progressSteps, setProgressSteps] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // UI Presentation States
  const [isArtifactMaximized, setIsArtifactMaximized] = useState(false);
  const [activeModalChart, setActiveModalChart] = useState(null);

  const chatContainerRef = useRef(null);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    setMessages((prev) => {
      if (prev[0]?.role !== "agent") return prev;
      return [{ ...prev[0], content: buildWelcomeMessage() }, ...prev.slice(1)];
    });
  }, [firstName]);

  const handleNewAnalysis = useCallback(async () => {
    if (sessionId) {
      try {
        await fetch(`${API_BASE}/api/session/${sessionId}`, {
          method: "DELETE",
        });
      } catch {}
    }
    setSessionId(null);
    setCharts([]);
    setIsLoading(false);
    setIsStreaming(false);
    setProgressSteps([]);
    setUploadedFile(null);
    setIsArtifactMaximized(false);
    setActiveModalChart(null);
    setMessages([
      {
        role: "agent",
        content: buildWelcomeMessage(),
      },
    ]);
  }, [sessionId]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file.name);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: `Uploaded dataset: ${file.name}` },
    ]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Upload failed (${res.status})`);
      }

      const data = await res.json();
      setSessionId(data.session_id);

      setMessages((prev) => [
        ...prev,
        { role: "agent", content: data.message },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: `**Upload error:** ${err.message}. Please try again.`,
        },
      ]);
      setUploadedFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || !sessionId) return;

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setIsStreaming(true);
    setProgressSteps([]);

    const url = `${API_BASE}/api/chat/stream?session_id=${encodeURIComponent(sessionId)}&message=${encodeURIComponent(text)}`;
    const eventSource = new EventSource(url);

    eventSource.addEventListener("step", (e) => {
      try {
        const data = JSON.parse(e.data);
        setProgressSteps((prev) => [...prev, data]);
      } catch {}
    });

    eventSource.addEventListener("chart", (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.filename) {
          setCharts((prev) => {
            if (prev.includes(data.filename)) return prev;
            return [...prev, data.filename];
          });
        }
      } catch {}
    });

    eventSource.addEventListener("done", (e) => {
      try {
        const data = JSON.parse(e.data);
        setMessages((prev) => [
          ...prev,
          { role: "agent", content: data.answer },
        ]);
        if (data.charts && data.charts.length > 0) {
          setCharts((prev) => {
            const newCharts = data.charts.filter((c) => !prev.includes(c));
            return [...prev, ...newCharts];
          });
        }
      } catch {}
      eventSource.close();
      setIsLoading(false);
      setIsStreaming(false);
    });

    eventSource.addEventListener("error", (e) => {
      if (eventSource.readyState === EventSource.CLOSED) {
        setIsLoading(false);
        setIsStreaming(false);
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: "**Connection lost.** The analysis may still be running. Please check the results or start a new analysis.",
        },
      ]);
      eventSource.close();
      setIsLoading(false);
      setIsStreaming(false);
    });
  };

  const handleDownloadAllCharts = () => {
    charts.forEach((chartName, idx) => {
      const url = `${API_BASE}/api/charts/${sessionId}/${chartName}`;
      downloadImageFile(url, `chart_${idx + 1}_${chartName}`);
    });
  };

  return (
    <div className="bg-surface text-on-surface h-screen flex overflow-hidden font-body">
      <Sidebar
        onNewAnalysis={handleNewAnalysis}
        sessionId={sessionId}
        messages={messages}
      />

      <div className="flex-1 flex overflow-hidden h-full relative">
        <main
          className={`flex-1 flex flex-col h-full bg-surface-bright relative border-r border-outline-variant transition-all duration-300 ${
            isArtifactMaximized
              ? "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"
              : "opacity-100"
          }`}
        >
          <section
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-32 bg-surface-bright/70"
          >
            <div className="max-w-chat-max-width mx-auto space-y-8">
              {messages.map((msg, index) => (
                <MessageBubble key={index} message={msg} />
              ))}

              {isStreaming && (
                <ProgressLog
                  steps={progressSteps}
                  isActive={isStreaming}
                />
              )}

              {isLoading && !isStreaming && <LoadingIndicator />}

              {!uploadedFile && !isLoading && (
                <div className="flex justify-center mt-6">
                  <input
                    type="file"
                    accept=".csv, .xlsx, .xls"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-semibold hover:bg-primary/90 transition shadow-sm"
                  >
                    <UploadCloud size={20} />
                    Upload Dataset
                  </button>
                </div>
              )}

              <div ref={bottomRef} id="anchor-bottom" />
            </div>
          </section>

          <div
            className={`${!uploadedFile ? "opacity-50 pointer-events-none" : ""}`}
          >
            <InputBarInline
              onSend={handleSendMessage}
              disabled={!uploadedFile || isLoading}
            />
          </div>
        </main>

        {charts.length > 0 && (
          <aside
            className={`flex flex-col bg-surface-container-lowest h-full border-l border-outline-variant overflow-hidden transition-all duration-300 shadow-xl ${
              isArtifactMaximized
                ? "fixed inset-y-0 right-0 left-0 md:left-auto md:w-[80vw] lg:w-[70vw] xl:w-[60vw] z-40"
                : "w-[450px] lg:w-[550px]"
            } animate-in slide-in-from-right-8`}
          >
            <ArtifactHeader
              chartCount={charts.length}
              isMaximized={isArtifactMaximized}
              onToggleMaximize={() =>
                setIsArtifactMaximized(!isArtifactMaximized)
              }
              onDownloadAll={handleDownloadAllCharts}
            />

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              {charts.map((chartName, idx) => {
                const chartUrl = `${API_BASE}/api/charts/${sessionId}/${chartName}`;
                const chartTitle = `Chart ${idx + 1}: ${chartName.split(".")[0]}`;

                return (
                  <ChartCard
                    key={idx}
                    title={chartTitle}
                    legendLabel="DATA VISUALIZATION"
                    imageSrc={chartUrl}
                    imageAlt={`Data visualization chart ${idx + 1}`}
                    onZoom={() =>
                      setActiveModalChart({ src: chartUrl, title: chartTitle })
                    }
                    onDownload={() =>
                      downloadImageFile(chartUrl, `${chartName}`)
                    }
                  />
                );
              })}
            </div>
          </aside>
        )}
      </div>

      {/* Lightbox / High-resolution Modal Workspace */}
      {activeModalChart && (
        <ImageModal
          src={activeModalChart.src}
          title={activeModalChart.title}
          onClose={() => setActiveModalChart(null)}
          onDownload={() =>
            downloadImageFile(
              activeModalChart.src,
              "expanded_visualization.png",
            )
          }
        />
      )}
    </div>
  );
};

export default ChatbotPage;
