import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, RotateCcw, Heart, Timer, Trophy, Flame, CheckCircle, 
  XCircle, Search, HelpCircle, Gamepad2, Sparkles, Smartphone, 
  ChevronRight, ArrowLeft, Volume2, Info, Eye, EyeOff
} from "lucide-react";

interface Question {
  id: number;
  emojis: string;
  answer: string;
  options: string[];
  answers: string[];
  image: string;
  video: string;
}

type GameMode = "none" | "emoji" | "photo";

// Synthesizer Sound Effects using Web Audio API
const playSound = (type: "ding" | "buzz" | "click") => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === "ding") {
      // High-grade game chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc2.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.12); // C6

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.6);
      osc2.stop(ctx.currentTime + 0.6);
    } else if (type === "buzz") {
      // Arcade synth error buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.4);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === "click") {
      // Clean micro-click transition sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    }
  } catch (err) {
    console.error("Audio Synthesis Error:", err);
  }
};

export default function AnimeEmojiGame() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedMode, setSelectedMode] = useState<GameMode>("none");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [wrongOptionClicked, setWrongOptionClicked] = useState<string | null>(null);
  const [textGuess, setTextGuess] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [bonusEarned, setBonusEarned] = useState(false);
  const [gameState, setGameState] = useState<"hub" | "playing" | "gameover" | "completed">("hub");
  const [isLoading, setIsLoading] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);

  // Clue and Reveal helper states
  const [revealBonus, setRevealBonus] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load questions from public/data.json
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/data.json");
        if (!response.ok) throw new Error("Failed to load questions");
        const data = await response.json();
        // Shuffle questions to make it exciting
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
      } catch (error) {
        console.error("Error loading anime questions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Timer loop
  useEffect(() => {
    if (gameState === "playing" && !isAnswered) {
      setTimeLeft(20);
      if (timerRef.current) clearInterval(timerRef.current);
      
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, gameState, isAnswered]);

  const handleTimeOut = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    playSound("buzz");
    setShakeTrigger(true);
    setTimeout(() => setShakeTrigger(false), 500);

    setIsCorrect(false);
    setIsAnswered(true);
    setLives((prev) => {
      const nextLives = prev - 1;
      if (nextLives <= 0) {
        setTimeout(() => setGameState("gameover"), 2200);
      }
      return nextLives;
    });
  };

  const checkTextGuess = () => {
    if (isAnswered) return;
    const cleanGuess = textGuess.trim().toLowerCase().replace(/\s+/g, "");
    if (!cleanGuess) return;

    const currentQuestion = questions[currentIdx];
    // Case-insensitive, space-insensitive match
    const matched = currentQuestion.answers.some(
      (ans) => ans.toLowerCase().replace(/\s+/g, "") === cleanGuess
    );

    evaluateAnswer(matched, currentQuestion.answer);
  };

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    const currentQuestion = questions[currentIdx];
    const matched = option === currentQuestion.answer;
    
    if (!matched) {
      setWrongOptionClicked(option);
      setShakeTrigger(true);
      setTimeout(() => setShakeTrigger(false), 500);
    }
    setSelectedOption(option);
    evaluateAnswer(matched, option);
  };

  const evaluateAnswer = (matched: boolean, chosenAnswer: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsAnswered(true);

    if (matched) {
      playSound("ding");
      setIsCorrect(true);
      
      // BONUS RULE: +5000 points if guessed correctly in first 5 seconds (timeLeft >= 15 seconds)
      const earnedBonus = timeLeft >= 15;
      setBonusEarned(earnedBonus);
      
      const questionScore = 1000;
      const bonusScore = earnedBonus ? 5000 : 0;
      setScore((prev) => prev + questionScore + bonusScore);
    } else {
      playSound("buzz");
      setIsCorrect(false);
      setLives((prev) => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          setTimeout(() => setGameState("gameover"), 2200);
        }
        return nextLives;
      });
    }
  };

  const handleNextQuestion = () => {
    playSound("click");
    setIsAnswered(false);
    setIsCorrect(false);
    setSelectedOption(null);
    setWrongOptionClicked(null);
    setTextGuess("");
    setBonusEarned(false);
    setRevealBonus(0);
    setHintUsed(false);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setGameState("completed");
    }
  };

  const startNewGame = (mode: GameMode) => {
    playSound("click");
    // Reshuffle questions on start
    const reshuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(reshuffled);
    setSelectedMode(mode);
    setCurrentIdx(0);
    setScore(0);
    setLives(5);
    setTimeLeft(20);
    setIsAnswered(false);
    setIsCorrect(false);
    setSelectedOption(null);
    setWrongOptionClicked(null);
    setTextGuess("");
    setBonusEarned(false);
    setRevealBonus(0);
    setHintUsed(false);
    setGameState("playing");
  };

  const returnToHub = () => {
    playSound("click");
    setGameState("hub");
    setSelectedMode("none");
  };

  const getMaskedHint = (answerStr: string) => {
    return answerStr
      .split(" ")
      .map((word) => {
        if (word.length <= 1) return word;
        if (word.length === 2) return word[0] + "_";
        const first = word[0];
        const last = word[word.length - 1];
        const middle = "_".repeat(word.length - 2);
        return `${first}${middle}${last}`;
      })
      .join(" ");
  };

  // Unblur ratio: from 24px (at 20s) down to 0px (at 0s).
  // We subtract revealBonus if they use the manual unblur hint!
  const currentBlur = isAnswered 
    ? 0 
    : Math.max(0, Math.round((timeLeft / 20) * 24) - revealBonus);

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      
      {/* EMULATOR FRAME CABINET (Immersive Phone Replica) */}
      <div className="w-full max-w-md bg-zinc-950 border-4 border-zinc-800 rounded-[3rem] shadow-[0_0_50px_rgba(236,72,153,0.15)] overflow-hidden relative flex flex-col min-h-[760px] md:min-h-[820px] aspect-[9/19]">
        
        {/* Phone Notch & Ear Piece */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-zinc-900 rounded-b-2xl z-40 flex items-center justify-center border-b border-x border-zinc-800/80">
          <div className="w-12 h-1 bg-zinc-800 rounded-full mb-1" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 absolute right-4 mb-1" />
        </div>

        {/* Dynamic Glass Screen Content */}
        <div className="w-full flex-1 flex flex-col bg-zinc-950 pt-10 pb-6 px-4 sm:px-6 relative text-white">
          
          {/* Glowing Ambient Background Circles */}
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-pink-500/10 rounded-full filter blur-[80px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full filter blur-[80px] pointer-events-none" />

          {/* SCREEN HEADER */}
          <div className="relative z-30 flex items-center justify-between pb-3 border-b border-white/5 mb-4">
            {gameState !== "hub" ? (
              <button 
                onClick={returnToHub}
                className="flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-pink-400 hover:text-pink-300 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>ГАРУУСАХ</span>
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <Gamepad2 className="w-4 h-4 text-pink-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
                  AMINA ARCADE
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                LIVE LOBBY
              </span>
            </div>
          </div>

          {/* MAIN SCREEN INTERACTIVE ROUTER */}
          <div className="flex-1 flex flex-col relative z-20 overflow-hidden">
            <AnimatePresence mode="wait">

              {/* GAME MODE SELECTION HUB */}
              {gameState === "hub" && (
                <motion.div
                  key="hub-screen"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="flex-1 flex flex-col justify-between py-4"
                >
                  <div className="text-center mt-4">
                    <span className="text-[10px] font-mono text-pink-500 font-bold uppercase tracking-widest block mb-1 bg-pink-500/10 py-1 px-3 rounded-full w-fit mx-auto border border-pink-500/10">
                      // АНИМЕ ертөнц
                    </span>
                    <h2 className="font-heading italic text-3xl sm:text-4xl leading-[1] tracking-tighter text-white mt-4">
                      АНУБИС СОРИЛТ
                    </h2>
                    <p className="text-[11px] font-body text-zinc-400 max-w-xs mx-auto mt-2 leading-relaxed">
                      Өөрийн харах хурд болон мэдлэгийг хамгийн аюултай бөгөөд хөгжилтэй сорилоор шалгаарай!
                    </p>
                  </div>

                  {/* Mode Chooser Cards */}
                  <div className="flex flex-col gap-3 my-6">
                    
                    {/* Mode A: Emoji Quiz */}
                    <button
                      onClick={() => startNewGame("emoji")}
                      className="group relative w-full text-left p-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 hover:border-pink-500/30 transition-all duration-300 overflow-hidden shadow-lg active:scale-98 cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/2 to-pink-500/0 group-hover:via-pink-500/5 transition-all" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-xl border border-pink-500/20">
                            🏴‍☠️
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-pink-400 font-semibold block">MODE A</span>
                            <h4 className="font-heading italic text-lg text-white group-hover:text-pink-400 transition-colors leading-tight">
                              Эможи Таавар
                            </h4>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-pink-400 transition-all group-hover:translate-x-1" />
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-2 font-body leading-normal">
                        Аниме бүрийн түүх, онцлогийг илэрхийлэх эможи цуглуулгуудыг уншин нэрийг тааж оноо цуглуулна.
                      </p>
                    </button>

                    {/* Mode B: Photo Reveal */}
                    <button
                      onClick={() => startNewGame("photo")}
                      className="group relative w-full text-left p-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 hover:border-purple-500/30 transition-all duration-300 overflow-hidden shadow-lg active:scale-98 cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/2 to-purple-500/0 group-hover:via-purple-500/5 transition-all" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-xl border border-purple-500/20">
                            🖼️
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-purple-400 font-semibold block">MODE B</span>
                            <h4 className="font-heading italic text-lg text-white group-hover:text-purple-400 transition-colors leading-tight">
                              Тодрох Зураг
                            </h4>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 transition-all group-hover:translate-x-1" />
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-2 font-body leading-normal">
                        <strong>БҮДЭГ ЗУРАГ ТОДОРНО!</strong> Эхний 5 секундэд тааж чадвал <span className="text-yellow-400 font-bold">+5000 BONUS</span> аваарай.
                      </p>
                    </button>

                  </div>

                  {/* Rules Footer banner inside Phone */}
                  <div className="bg-white/2 border border-white/5 rounded-xl p-3 text-center">
                    <span className="text-[9px] font-mono text-zinc-500 block uppercase mb-1">ГҮЙЦЭТГЭЛИЙН ДҮРЭМ</span>
                    <p className="text-[10px] font-body text-zinc-400 leading-tight">
                      Асуулт тус бүр <strong>20 сек</strong> • Нийт <strong>5 амьтай</strong> • Зөв бол <strong>1,000 оноо</strong>
                    </p>
                  </div>
                </motion.div>
              )}


              {/* ACTIVE PLAYING SCREEN */}
              {gameState === "playing" && questions.length > 0 && (
                <motion.div
                  key="playing-screen"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-1 flex flex-col justify-between"
                >
                  
                  {/* LIVE DASHBOARD HUD STATS */}
                  <div className="grid grid-cols-3 gap-2 bg-white/2 border border-white/5 p-2 rounded-xl text-center mb-3">
                    
                    {/* Lives representation */}
                    <div className="flex flex-col items-center justify-center border-r border-white/5">
                      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">LIVES</span>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[...Array(5)].map((_, idx) => (
                          <Heart
                            key={idx}
                            className={`w-3.5 h-3.5 transition-all duration-300 ${
                              idx < lives 
                                ? "text-rose-500 fill-rose-500 scale-100 drop-shadow-[0_0_4px_rgba(244,63,94,0.4)]" 
                                : "text-white/10 fill-none scale-90"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Timer Circle */}
                    <div className="flex flex-col items-center justify-center border-r border-white/5">
                      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">TIME</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Timer className={`w-3.5 h-3.5 ${timeLeft <= 5 ? "text-rose-500 animate-pulse" : "text-yellow-400"}`} />
                        <span className={`text-[11px] font-mono font-bold ${timeLeft <= 5 ? "text-rose-400 animate-pulse" : "text-yellow-300"}`}>
                          {timeLeft}s
                        </span>
                      </div>
                    </div>

                    {/* Score readout */}
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">SCORE</span>
                      <span className="text-[11px] font-mono font-bold text-emerald-400 mt-0.5">
                        {score} pts
                      </span>
                    </div>

                  </div>

                  {/* SHAKEABLE PLAY CARD CONTAINER */}
                  <motion.div
                    animate={shakeTrigger ? "shake" : "normal"}
                    variants={{
                      shake: {
                        x: [0, -10, 10, -10, 10, -5, 5, 0],
                        transition: { duration: 0.4 }
                      },
                      normal: { x: 0 }
                    }}
                    className="flex-1 flex flex-col justify-between bg-zinc-900/60 border border-white/5 rounded-2xl p-4 overflow-hidden relative"
                  >
                    
                    {/* Dynamic Graphic Top Block */}
                    <div className="flex-1 flex flex-col justify-center relative min-h-[220px]">
                      
                      {selectedMode === "emoji" ? (
                        /* EMOJI MODE SCREEN */
                        <div className="flex flex-col items-center text-center w-full">
                          <span className="text-[8px] font-mono text-pink-400 tracking-wider uppercase bg-pink-500/10 px-2 py-0.5 rounded mb-3 border border-pink-500/10">
                            Эможи Таавар {currentIdx + 1}/{questions.length}
                          </span>
                          
                          {isAnswered ? (
                            /* When answered, show the anime poster image! */
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="w-full flex flex-col items-center"
                            >
                              <div className="relative rounded-xl overflow-hidden w-full h-36 border border-white/5 bg-zinc-950 mb-2 select-none">
                                <img
                                  src={questions[currentIdx].image}
                                  alt="anime-visual"
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-pink-300 font-mono font-bold border border-white/5">
                                  {questions[currentIdx].emojis}
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div 
                              initial={{ scale: 0.85 }}
                              animate={{ scale: 1 }}
                              className="text-4xl sm:text-5xl tracking-wide font-extrabold my-4 filter drop-shadow-[0_4px_10px_rgba(244,63,94,0.3)]"
                            >
                              {questions[currentIdx].emojis}
                            </motion.div>
                          )}
                          
                          <p className="text-[10px] text-zinc-400 font-body mb-3">
                            {isAnswered ? "Асуулт амжилттай дууслаа!" : "Энэ ямар алдартай аниме бүтээл вэ?"}
                          </p>

                          {/* Dynamic Hint Clue */}
                          {!isAnswered && (
                            <div className="w-full max-w-[240px] mt-2">
                              {hintUsed ? (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="p-2.5 rounded-xl bg-pink-500/15 border border-pink-500/20 text-center"
                                >
                                  <span className="text-[7px] font-mono text-pink-400 block uppercase tracking-wider">ОЙРОЛЦОО ҮГ / ЗӨВЛӨГӨӨ:</span>
                                  <span className="text-xs font-mono font-bold text-pink-300 tracking-widest block mt-0.5">
                                    {getMaskedHint(questions[currentIdx].answer)}
                                  </span>
                                </motion.div>
                              ) : (
                                <button
                                  onClick={() => {
                                    playSound("click");
                                    setHintUsed(true);
                                  }}
                                  className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-pink-500/25 text-white font-semibold text-[10px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                                  <span>Зөвлөгөө авах (Ойролцоо үг)</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* PHOTO REVEAL MODE SCREEN WITH UNBLUR MECHANIC */
                        <div className="w-full h-full flex flex-col items-center justify-center relative rounded-xl overflow-hidden min-h-[200px] border border-white/5 bg-black">
                          
                          {/* Main image with transition blur */}
                          <img
                            src={questions[currentIdx].image}
                            alt="anime-visual"
                            referrerPolicy="no-referrer"
                            style={{ filter: `blur(${currentBlur}px)` }}
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                          />

                          {/* Top Dark Overlays */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />

                          {/* Indicators overlays */}
                          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                            <span className="text-[7px] font-mono text-purple-400 font-bold tracking-widest bg-purple-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-purple-500/20">
                              ТОДРОХ ЗУРАГ {currentIdx + 1}/{questions.length}
                            </span>
                            
                            {/* Bonus Speed Indicator */}
                            {timeLeft >= 15 && !isAnswered && (
                              <span className="text-[7px] font-mono text-yellow-300 font-bold tracking-wider bg-yellow-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-yellow-500/20 animate-pulse">
                                🔥 SPEED BONUS (+5000 PT)
                              </span>
                            )}
                          </div>

                          {/* Bottom Hint or Blur amount */}
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 w-fit flex items-center gap-1.5">
                            <span className="text-[8px] font-mono text-white/70 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded border border-white/5">
                              {isAnswered ? "БҮРЭН ТОДОРЛОО!" : `Бүдэгшилт: ${currentBlur}px`}
                            </span>

                            {/* Manual Unblur Action */}
                            {!isAnswered && (
                              <button
                                onClick={() => {
                                  playSound("click");
                                  setRevealBonus(prev => prev + 6);
                                }}
                                className="text-[8px] font-mono font-bold text-purple-200 bg-purple-600/90 hover:bg-purple-500 hover:text-white px-2.5 py-1 rounded shadow-lg flex items-center gap-1 transition-all cursor-pointer border border-purple-400/30 active:scale-95"
                              >
                                <Eye className="w-3.5 h-3.5 text-purple-200 animate-pulse" />
                                <span>ИЛҮҮ ТОДРУУЛАХ</span>
                              </button>
                            )}
                          </div>

                        </div>
                      )}

                      {/* Speed Bonus Earned Banner */}
                      {bonusEarned && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute inset-x-0 bottom-2 bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-center py-1 rounded-lg text-[9px] font-bold font-mono tracking-widest flex items-center justify-center gap-1"
                        >
                          <Flame className="w-3 h-3 text-yellow-400 animate-bounce fill-yellow-400" />
                          <span>+5,000 СЕКУНДЫН ОНЦГОЙ БОНУС ОНЦОЛЛОО!</span>
                        </motion.div>
                      )}

                    </div>

                    {/* DYNAMIC FOOTER SECTION (Option list vs Poster preview depending on answer state) */}
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <AnimatePresence mode="wait">
                        
                        {!isAnswered ? (
                          /* 4 MULTIPLE CHOICE OPTION BUTTONS */
                          <motion.div
                            key="options-block"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col gap-2"
                          >
                            {questions[currentIdx].options.map((option, idx) => {
                              const isSelected = selectedOption === option;
                              return (
                                <motion.button
                                  key={idx}
                                  onClick={() => handleOptionClick(option)}
                                  whileHover={{ 
                                    scale: 1.02, 
                                    boxShadow: "0px 0px 10px rgba(236, 72, 153, 0.2)",
                                    backgroundColor: "rgba(255,255,255,0.06)"
                                  }}
                                  whileTap={{ scale: 0.98 }}
                                  className="w-full text-left p-3.5 rounded-xl text-xs font-body border border-white/10 bg-white/3 hover:border-pink-500/20 transition-all cursor-pointer text-white flex items-center justify-between"
                                >
                                  <span>{option}</span>
                                  <span className="text-[9px] font-mono text-white/20">0{idx + 1}</span>
                                </motion.button>
                              );
                            })}
                          </motion.div>
                        ) : (
                          /* RESPONSE FEEDBACK BANNER */
                          <motion.div
                            key="feedback-block"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col gap-3"
                          >
                            <div className={`p-3 rounded-xl border ${
                              isCorrect 
                                ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300" 
                                : "bg-rose-950/30 border-rose-500/30 text-rose-300"
                            }`}>
                              <div className="flex items-center gap-2">
                                {isCorrect ? (
                                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-rose-400" />
                                )}
                                <div className="text-left">
                                  <span className="text-[8px] font-mono uppercase block">
                                    {isCorrect ? "ЗӨВ ХАРИУЛЛАА!" : "БУРУУ ХАРИУЛЛАА!"}
                                  </span>
                                  <p className="text-[10px] font-semibold mt-0.5">
                                    Зөв: <strong className="text-white underline">{questions[currentIdx].answer}</strong>
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* TEXT GUESSING FOR QUICK SKIP */}
                            <button
                              onClick={handleNextQuestion}
                              className="w-full py-3 rounded-xl bg-white hover:bg-zinc-100 text-black font-bold font-body text-xs text-center transition-all cursor-pointer"
                            >
                              ДАРААГИЙН АСУУЛТ →
                            </button>
                          </motion.div>
                        )}

                      </AnimatePresence>
                    </div>

                    {/* MANUAL TYPE WRITING GUESS (CAN GUESS BOTH WAYS) */}
                    {!isAnswered && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <input
                          type="text"
                          placeholder="Шууд нэрийг бичиж шалгах..."
                          value={textGuess}
                          onChange={(e) => setTextGuess(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") checkTextGuess();
                          }}
                          className="flex-1 bg-white/5 hover:bg-white/8 focus:bg-white/10 outline-none border border-white/5 focus:border-pink-500/30 rounded-xl px-3 py-2.5 text-[11px] font-body text-white placeholder-zinc-500"
                        />
                        <button
                          onClick={checkTextGuess}
                          disabled={!textGuess.trim()}
                          className={`px-3 py-2.5 rounded-xl font-bold font-body text-[10px] transition-all ${
                            textGuess.trim()
                              ? "bg-pink-500 text-white hover:bg-pink-600 cursor-pointer"
                              : "bg-white/5 text-zinc-600 cursor-not-allowed"
                          }`}
                        >
                          Шалгах
                        </button>
                      </div>
                    )}

                  </motion.div>

                </motion.div>
              )}


              {/* GAME OVER MODULE */}
              {gameState === "gameover" && (
                <motion.div
                  key="gameover-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center py-6"
                >
                  <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-3xl mb-4 text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                    💔
                  </div>
                  <h3 className="font-heading italic text-2xl text-white">СОРИЛТЫГ ДАВСАНГҮЙ</h3>
                  <p className="text-[11px] text-zinc-400 font-body max-w-xs mx-auto mt-2 leading-relaxed">
                    Амь дууслаа. Аниме сорилын нарийн ширийнийг маш сайн ойлгож, нийт{" "}
                    <strong className="text-yellow-400 font-bold">{score}</strong> оноо авлаа.
                  </p>

                  <div className="mt-8 flex flex-col gap-2 w-full">
                    <button
                      onClick={() => startNewGame(selectedMode)}
                      className="w-full py-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold font-body text-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>ДАХИН ЭХЛЭХ</span>
                    </button>
                    
                    <button
                      onClick={returnToHub}
                      className="w-full py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold font-body text-xs cursor-pointer"
                    >
                      ҮНДСЭН ЦЭС
                    </button>
                  </div>
                </motion.div>
              )}


              {/* COMPLETED SUCCESS SCREEN */}
              {gameState === "completed" && (
                <motion.div
                  key="completed-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center py-6"
                >
                  <div className="w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-4xl mb-4 text-yellow-400 animate-bounce">
                    👑
                  </div>
                  <h3 className="font-heading italic text-3xl text-white">ТӨГСГӨЛӨӨ ХҮРЛЭЭ!</h3>
                  <p className="text-[11px] text-zinc-400 font-body max-w-xs mx-auto mt-2 leading-relaxed">
                    Амжилттай! Та дуртай аниме сорилтын бүхий л хэцүү даалгавруудыг тааж, одоор гэрэлтсэн хаан ширээнд суух эрхтэй боллоо!
                  </p>

                  {/* High score box */}
                  <div className="bg-white/3 border border-white/5 rounded-2xl p-4 w-full my-6 grid grid-cols-2 gap-2">
                    <div className="border-r border-white/5">
                      <span className="text-[8px] font-mono text-zinc-500 block">АВСАН ОНОО</span>
                      <span className="font-heading italic text-xl text-yellow-300">{score} оо</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-zinc-500 block">ҮЛДСЭН АМЬ</span>
                      <span className="font-heading italic text-xl text-rose-400">{lives} / 5</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <button
                      onClick={() => startNewGame(selectedMode)}
                      className="w-full py-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold font-body text-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>ДАХИН ТОГЛОХ</span>
                    </button>

                    <button
                      onClick={returnToHub}
                      className="w-full py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold font-body text-xs cursor-pointer"
                    >
                      ҮНДСЭН ЦЭС
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* SCREEN FOOTER (SIMULATED NAVIGATION BAR) */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-around text-zinc-600 text-[10px] font-mono select-none">
            <span className="hover:text-pink-400 cursor-pointer transition-colors" onClick={returnToHub}>
              ARCADE HOME
            </span>
            <span className="text-zinc-800">|</span>
            <span className="hover:text-pink-400 transition-colors">v1.2.5 LIVE</span>
          </div>

        </div>

        {/* BOTTOM HOME BUTTON (Phone Casing Element) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-800 rounded-full" />
      </div>

    </div>
  );
}
