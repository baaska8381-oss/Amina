import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface WordPair {
  foreign: string; // Russian or English IT term
  meaning: string; // Mongolian
  lang: "Англи" | "Орос";
}

export default function VolleyballSpiker() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [ballY, setBallY] = useState(30); // vertical position: 20 -> top, 80 -> bottom
  const [ballDirection, setBallDirection] = useState(1); // 1 = down, -1 = up
  const [currentWord, setCurrentWord] = useState<WordPair | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [langFilter, setLangFilter] = useState<"Бүгд" | "Англи" | "Орос">("Бүгд");

  const database: WordPair[] = [
    // English IT engineering terms
    { foreign: "Software Developer", meaning: "Програм Хангамжийн Хөгжүүлэгч", lang: "Англи" },
    { foreign: "Database Server", meaning: "Мэдээллийн Сангийн Сервер", lang: "Англи" },
    { foreign: "Artificial Intelligence", meaning: "Хиймэл Оюун Ухаан", lang: "Англи" },
    { foreign: "Algorithm Loop", meaning: "Алгоритмын Давталт", lang: "Англи" },
    { foreign: "User Interface", meaning: "Хэрэглэгчийн Интерфэйс", lang: "Англи" },
    { foreign: "Cybersecurity", meaning: "Кибер Аюулгүй Байдал", lang: "Англи" },
    // Russian vocabulary
    { foreign: "Программист", meaning: "Программист (Код бичигч)", lang: "Орос" },
    { foreign: "База данных", meaning: "Мэдээллийн сан", lang: "Орос" },
    { foreign: "Искусственный интеллект", meaning: "Хиймэл оюун ухаан", lang: "Орос" },
    { foreign: "Алгоритм", meaning: "Дараалсан зааварчилгаа", lang: "Орос" },
    { foreign: "Компьютерные сети", meaning: "Компьютерын сүлжээ", lang: "Орос" },
    { foreign: "Инженер", meaning: "Инженер (Мэргэжилтэн)", lang: "Орос" },
  ];

  const generateWord = () => {
    let filtered = database;
    if (langFilter !== "Бүгд") {
      filtered = database.filter((x) => x.lang === langFilter);
    }
    const selected = filtered[Math.floor(Math.random() * filtered.length)];
    setCurrentWord(selected);

    // Create selection choices
    const choices = new Set<string>();
    choices.add(selected.meaning);
    while (choices.size < 3) {
      const rand = database[Math.floor(Math.random() * database.length)].meaning;
      choices.add(rand);
    }
    setOptions(Array.from(choices).sort(() => Math.random() - 0.5));
    
    // Set ball to top of trajectory
    setBallY(30);
    setBallDirection(1); // Starts falling down
  };

  useEffect(() => {
    if (isPlaying) {
      generateWord();
    }
  }, [isPlaying, langFilter]);

  // Ball falling animation tick
  useEffect(() => {
    if (!isPlaying || !currentWord) return;

    const timer = setInterval(() => {
      setBallY((y) => {
        let nextY = y + 2 * ballDirection;
        // If ball falls past bottom edge, it's a floor hit (loss)
        if (nextY >= 80) {
          setStreak(0);
          setFeedback("Бөмбөг газар уналаа! Дахин оролдоно уу.");
          generateWord();
          return 30;
        }
        return nextY;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [isPlaying, ballDirection, currentWord]);

  const handleAnswer = (choice: string) => {
    if (!currentWord) return;

    if (choice === currentWord.meaning) {
      setScore((s) => s + 15);
      setStreak((st) => st + 1);
      setFeedback("Гайхалтай довтолгоо (SPIKE) амжилттай боллоо! 🏐🔥");
      
      // Animate hit up
      setBallDirection(-1);
      setTimeout(() => {
        generateWord();
      }, 800);
    } else {
      setStreak(0);
      setFeedback("Алдаа гарлаа! Бөмбөг тор давахгүй уналаа. ✕");
      setBallDirection(1);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h4 className="font-heading italic text-2xl text-white">Volleyball IT Spiker</h4>
          <p className="text-xs text-white/60 font-body">Дуртай Воллейбол спорт болон Хэлний сургалтыг IT-тай хослуулсан тоглоом</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/50">Хэлний сонголт:</span>
          {["Бүгд", "Англи", "Орос"].map((ln) => (
            <button
              key={ln}
              onClick={() => setLangFilter(ln as any)}
              className={`px-3 py-1 rounded-full text-xs font-body transition-colors cursor-pointer ${
                langFilter === ln
                  ? "bg-white text-black font-semibold"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {ln}
            </button>
          ))}
        </div>
      </div>

      {!isPlaying ? (
        <div className="liquid-glass p-6 rounded-2xl flex flex-col items-center justify-center text-center py-10">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl mb-4 text-white">
            🏐
          </div>
          <h5 className="font-heading italic text-3xl text-white mb-2">Space Volleyball Match</h5>
          <p className="text-xs text-white/70 font-body max-w-sm ml-auto mr-auto leading-relaxed mb-6">
            Сансар огторгуйд воллейболын бөмбөг бууж ирнэ. Бөмбөгөн дээр харагдах Орос эсвэл Англи IT үгийн зөв утгыг доорх сонголтоос зөв сонговол бөмбөгийг маш хүчтэйгээр ДЭЭШ ИЛГЭЭН Дараагийн аялал руу хүрэх болно!
          </p>
          <button
            onClick={() => {
              setIsPlaying(true);
              setScore(0);
              setStreak(0);
              setFeedback("");
            }}
            className="bg-white hover:bg-white/90 text-black py-2.5 px-6 rounded-full font-bold font-body text-xs cursor-pointer tracking-wider"
          >
            ТЭМЦЭЭНИЙГ ЭХЛҮҮЛЭХ
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Volleyball Court Sandbox */}
          <div className="md:col-span-2 bg-black/50 border border-white/10 rounded-2xl relative h-[280px] overflow-hidden flex flex-col justify-between p-4">
            
            <div className="flex justify-between items-center z-10">
              <span className="text-xs font-mono text-white/40">Оноо: <strong className="text-white text-sm">{score}</strong></span>
              <span className="text-xs font-mono text-white/40">Одоогийн Дараалал: <strong className="text-emerald-400 text-sm">{streak}🏐</strong></span>
            </div>

            {/* Simulated Court Net */}
            <div className="absolute left-0 bottom-0 w-full h-[60px] bg-white/5 border-t border-dashed border-white/20 select-none flex items-center justify-center text-[10px] text-white/20 uppercase tracking-widest font-mono">
              Шороон буулт (Гар бөмбөг тор)
            </div>

            {/* Falling Ball visual */}
            <AnimatePresence>
              {currentWord && (
                <motion.div
                  className="absolute left-1/2 -ml-12 w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 border border-white/30 flex flex-col items-center justify-center text-center p-2 shadow-2xl z-10"
                  animate={{
                    top: `${ballY}%`,
                    x: ["-50%", "-51%", "-49%", "-50%"],
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <div className="text-lg">🏐</div>
                  <div className="text-[10px] font-bold tracking-tight text-white/90 font-mono truncate max-w-full">
                    {currentWord.foreign}
                  </div>
                  <div className="text-[8px] mt-0.5 uppercase text-yellow-300 font-mono">
                    {currentWord.lang}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="w-full text-center pb-2 z-10">
              <span className={`text-xs font-semibold ${feedback.includes("Алдаа") ? "text-rose-400" : "text-emerald-300"}`}>
                {feedback || "Бөмбөг аажмаар доошилж байна..."}
              </span>
            </div>

          </div>

          {/* Spell Answers Panel */}
          <div className="liquid-glass rounded-2xl p-6 flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-white/50 block mb-2">Оновчтой Сонголт</span>
              <p className="text-xs text-white/80 font-body mb-4">Бөмбөгийг хүчтэй Довтлох (Spike) орчуулгыг сонгоно уу:</p>
              
              <div className="flex flex-col gap-2.5">
                {options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    className="w-full text-left liquid-glass hover:bg-white/10 text-white font-body text-xs p-3.5 rounded-xl transition-all active:scale-95 cursor-pointer flex justify-between items-center group"
                  >
                    <span>{option}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 px-2 py-0.5 rounded text-[8px] uppercase">
                      Spike!
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsPlaying(false)}
              className="text-xs text-white/40 hover:text-white/60 mt-4 text-center cursor-pointer font-mono"
            >
              Тоглоомоос гарах
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
