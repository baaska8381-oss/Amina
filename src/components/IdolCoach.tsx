import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, RefreshCw, Star, Music, Award, ArrowRight } from "lucide-react";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function IdolCoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Ёоо, юу байна даа, найз минь? Одоо яг Ebo нь байна. Надад чамд өгөх эрч хүч, урам зориг зөндөө байна уу гэхээс дутна гэж байхгүй шүү. Амьдрал угаасаа нэг гоё хэмнэлтэй дуу шиг, заримдаа гунигтай ая явж байвч дараа нь заавал гоё хөгжилтэй хэсэг орж ирдэг юм. Тэгэхээр өнөөдөр юуны тухай яримаар байна? Чиний зорилго уу, эсвэл зүгээр л дотор чинь байгаа гоё санаанууд уу? Сонсоход бэлэн байна, хуваалцаарай!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionPrompts = [
    "Хөгжмийн замналаа хэрхэн эхлүүлэх вэ?",
    "Дарханаас тэгээс эхэлсэн түүхээсээ хуваалцаач",
    "IT уу, спорт уу? Аль альныг нь амжуулах зөвлөгөө",
    "Урам зориг авахаар гоё үг хэлээч хөгшөөн!"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setError(null);
    const userMsg = textToSend.trim();
    setInput("");

    // Append user message
    const updatedMessages = [...messages, { role: "user" as const, text: userMsg }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/chat/ebo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMsg,
          history: messages, // Send history to maintain context
        }),
      });

      if (!response.ok) {
        throw new Error("Уучлаарай, системд алдаа гарлаа. Дахин оролдоно уу.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { role: "model", text: data.text }]);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Холболтонд алдаа гарлаа. Сүлжээгээ шалгана уу.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "model",
        text: "Ёоо, юу байна даа, найз минь? Одоо яг Ebo нь байна. Надад чамд өгөх эрч хүч, урам зориг зөндөө байна уу гэхээс дутна гэж байхгүй шүү. Амьдрал угаасаа нэг гоё хэмнэлтэй дуу шиг, заримдаа гунигтай ая явж байвч дараа нь заавал гоё хөгжилтэй хэсэг орж ирдэг юм. Тэгэхээр өнөөдөр юуны тухай яримаар байна? Чиний зорилго уу, эсвэл зүгээр л дотор чинь байгаа гоё санаанууд уу? Сонсоход бэлэн байна, хуваалцаарай!"
      }
    ]);
    setError(null);
  };

  return (
    <div id="idol-coach-chat" className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Coach Info Sidebar (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="liquid-glass p-6 rounded-2xl border border-white/5 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xl shadow-lg border border-white/10">
                  E
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full animate-pulse" />
              </div>
              <div>
                <h4 className="font-heading italic text-xl text-white">Ebo (Бат-Эрдэнэ)</h4>
                <p className="text-[10px] font-mono text-violet-400 tracking-wider uppercase">Idol Coach & Vandebo Member</p>
              </div>
            </div>

            <p className="text-xs text-white/70 font-body leading-relaxed mb-4">
              Монголын хөгжмийн салбарт R&B уянгалаг стиль, өвөрмөц melodic дуулалтаараа залуусыг байлдан дагуулж буй Vandebo хамтлагийн гишүүн Ebo. Тэрээр Дарханаас гараагаа эхэлж, өөрийн зорилгодоо тууштай тэмцсээр өөрсдийн орон зайг бүтээсэн юм.
            </p>

            {/* Quick stats/facts */}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-white/60 font-body">
                <Music className="w-3.5 h-3.5 text-violet-400" />
                <span>Дуулах стиль: <strong className="text-white font-medium">Melodic, R&B</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60 font-body">
                <Award className="w-3.5 h-3.5 text-yellow-400" />
                <span>Хитүүд: <strong className="text-white font-medium">Too Deep, Haru Haru, Буруу хүн</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60 font-body">
                <Star className="w-3.5 h-3.5 text-fuchsia-400" />
                <span>Онцлог: <strong className="text-white font-medium">Торгомсог хоолой, дууны үг, ая</strong></span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-[11px] text-white/40 font-mono">
              <span>СТАТУС: ИДЭВХТЭЙ</span>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-white/50 hover:text-white transition-colors cursor-pointer"
                title="Чатыг шинэчлэх"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Шинэчлэх</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area (8 cols) */}
      <div className="lg:col-span-8 flex flex-col h-[520px] liquid-glass rounded-2xl border border-white/5 overflow-hidden">
        {/* Chat header */}
        <div className="px-6 py-4 border-b border-white/5 bg-white/2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-mono text-white/80 tracking-widest uppercase">Ebo Coach-той ярилцах</span>
          </div>
          <span className="text-[10px] font-mono text-white/40">Powered by Gemini AI</span>
        </div>

        {/* Message stream */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col max-w-[85%] ${
                msg.role === "user" ? "self-end items-end" : "self-start items-start"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-mono text-white/40">
                  {msg.role === "user" ? "Чи" : "Ebo Coach"}
                </span>
              </div>
              <div
                className={`p-3.5 rounded-2xl text-xs md:text-sm font-body leading-relaxed whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-tr-none shadow-md"
                    : "bg-white/5 border border-white/5 text-white/90 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex flex-col items-start max-w-[80%] self-start">
              <span className="text-[10px] font-mono text-white/40 mb-1">Ebo Coach</span>
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-950/20 border border-rose-900/30 text-rose-300 text-xs rounded-xl self-center font-body max-w-md text-center">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion prompt bar */}
        {messages.length === 1 && !loading && (
          <div className="px-6 py-2 bg-black/20 border-t border-white/5 flex flex-wrap gap-2">
            {suggestionPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-[11px] font-body bg-white/5 hover:bg-white/10 text-white/80 border border-white/5 rounded-full px-3 py-1.5 transition-all hover:scale-101 active:scale-99 cursor-pointer flex items-center gap-1"
              >
                <span>{prompt}</span>
                <ArrowRight className="w-3 h-3 text-white/40" />
              </button>
            ))}
          </div>
        )}

        {/* Chat Input */}
        <div className="p-4 border-t border-white/5 bg-white/1 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend(input);
            }}
            placeholder="Энд асуулт, санаагаа бичээрэй найз минь..."
            className="flex-1 bg-white/5 hover:bg-white/8 focus:bg-white/8 focus:ring-1 focus:ring-violet-500/50 outline-none border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-white/30 font-body transition-all"
            disabled={loading}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={loading || !input.trim()}
            className={`p-3 rounded-xl flex items-center justify-center transition-all ${
              input.trim() && !loading
                ? "bg-white hover:bg-neutral-200 text-black cursor-pointer hover:scale-102"
                : "bg-white/5 text-white/20 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
