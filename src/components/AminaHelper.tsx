import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Send, Sparkles, Heart, Smile, X, RefreshCw, AlertCircle, ShieldAlert } from "lucide-react";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function AminaHelper() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Сайн байна уу! Уу уааав (uu wuaww), миний бэлдсэн portfolio-д тавтай морилно уу! 🌸 Би бол Амин-Одын AI туслах, намайг Амина гэж дуудаж болноо хэхэ. Танд манай сайтын Math тоглоом, Vandebo хэмнэлтэй тоглоом, волейболын сонирхолтой хэсгүүдийг тайлбарлаж өгөх эсвэл сонирхсон асуултанд чинь хариулахад бэлэн байна. Өнөөдөр юуны тухай ярилцмаар байна? 🥰"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionPrompts = [
    "Энэ сайтын тухай тайлбарлаж өгөөч?",
    "Ямар хобби, сонирхолтой вэ?",
    "Lovely Runner-ийн талаар яриач!",
    "Ирээдүйн мөрөөдөл нь юу вэ? ✨"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  // Handle global custom event to trigger opening this chat
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      setShowTooltip(false);
    };
    window.addEventListener("open-amina-chat", handleOpenChat);
    return () => {
      window.removeEventListener("open-amina-chat", handleOpenChat);
    };
  }, []);

  // Hide tooltip after some time anyway
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setError(null);
    const userMsg = textToSend.trim();
    setInput("");

    const updatedMessages = [...messages, { role: "user" as const, text: userMsg }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/chat/amina", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMsg,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Уучлаарай, холболтонд алдаа гарлаа хэхэ. Дахин оролдоно уу.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { role: "model", text: data.text }]);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Алдаа гарлаа. Түр хүлээгээд дахин бичээрэй.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "model",
        text: "Уу уааав (uu wuaww), чатыг амжилттай шинэчиллээ хэхэ! Дахин шинээр ярилцахад бэлэн байна. Юу мэдмээр байна? 🌸"
      }
    ]);
    setError(null);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
        {/* Cute Speech Tooltip */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="relative bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs py-2 px-4 rounded-full shadow-xl border border-pink-400/20 font-body font-medium flex items-center gap-2 max-w-xs text-nowrap"
            >
              <span>Amina-тай ярилцах уу? 🌸</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="text-white/80 hover:text-white transition-colors p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {/* Arrow pointer */}
              <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-rose-600 rotate-45 transform" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing Launcher Avatar */}
        <motion.button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowTooltip(false);
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl cursor-pointer border focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all ${
            isOpen 
              ? "bg-zinc-900 border-white/10" 
              : "bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 border-pink-400/30"
          }`}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative flex items-center justify-center"
              >
                <MessageCircle className="w-6 h-6 animate-pulse" />
                <span className="absolute top-[-3px] right-[-3px] w-3 h-3 bg-emerald-400 rounded-full border-2 border-pink-500 animate-ping" />
                <span className="absolute top-[-3px] right-[-3px] w-3 h-3 bg-emerald-400 rounded-full border-2 border-pink-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Floating Chat Box Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] sm:w-[390px] h-[520px] max-w-[calc(100vw-2rem)] flex flex-col liquid-glass rounded-2xl border border-pink-500/20 shadow-2xl overflow-hidden bg-black/95 backdrop-blur-md"
          >
            {/* Header section with gradient */}
            <div className="px-5 py-3.5 border-b border-white/5 bg-gradient-to-r from-pink-950/20 via-rose-950/20 to-black flex items-center justify-between select-none">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white font-bold text-sm border border-white/20 shadow">
                    A
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-black rounded-full" />
                </div>
                <div>
                  <h4 className="font-heading italic text-sm text-white flex items-center gap-1">
                    Amina <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                  </h4>
                  <p className="text-[9px] font-mono text-pink-400 tracking-wider uppercase">Амин-Одын туслах</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                  title="Чатыг шинэчлэх"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                  title="Хаах"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Privacy Alert banner */}
            <div className="bg-pink-950/15 border-b border-pink-900/10 px-4 py-1.5 flex items-center gap-2 select-none">
              <ShieldAlert className="w-3 h-3 text-pink-400 shrink-0" />
              <span className="text-[10px] text-pink-300 font-body">Гэрийн хаяг, утас гэх мэт хувийн нууцыг хамгаална 🔒</span>
            </div>

            {/* Messages Content Stream */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3.5 custom-scrollbar bg-black/40">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col max-w-[85%] ${
                    msg.role === "user" ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <span className="text-[9px] font-mono text-white/30 mb-0.5 select-none">
                    {msg.role === "user" ? "Та" : "Amina"}
                  </span>
                  <div
                    className={`p-3 rounded-2xl text-xs font-body leading-relaxed whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-tr-none shadow-md border border-pink-400/20"
                        : "bg-white/5 border border-white/5 text-white/90 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex flex-col items-start max-w-[80%] self-start">
                  <span className="text-[9px] font-mono text-white/30 mb-0.5">Amina</span>
                  <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              {error && (
                <div className="p-2.5 bg-rose-950/20 border border-rose-900/30 text-rose-300 text-xs rounded-xl self-center font-body text-center flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{error}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Prompts */}
            {messages.length === 1 && !loading && (
              <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex flex-wrap gap-1.5">
                {suggestionPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="text-[10px] font-body bg-white/5 hover:bg-pink-500/10 text-white/80 hover:text-pink-200 border border-white/5 rounded-full px-2.5 py-1 transition-all hover:scale-101 active:scale-99 cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input form */}
            <div className="p-3 border-t border-white/5 bg-white/1 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend(input);
                }}
                placeholder="Энд Аминатай ярилцаарай... 🥰"
                className="flex-1 bg-white/5 hover:bg-white/8 focus:bg-white/8 focus:ring-1 focus:ring-pink-500/35 outline-none border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 font-body transition-all"
                disabled={loading}
              />
              <button
                onClick={() => handleSend(input)}
                disabled={loading || !input.trim()}
                className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                  input.trim() && !loading
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white cursor-pointer hover:scale-103"
                    : "bg-white/5 text-white/20 cursor-not-allowed"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
