import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface MathHistoryItem {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export default function MathGame() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState("+");
  const [options, setOptions] = useState<number[]>([]);
  const [spellPower, setSpellPower] = useState(100);
  const [harryPotterHouse, setHarryPotterHouse] = useState("Gryffindor");
  const [spellEffect, setSpellEffect] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [history, setHistory] = useState<MathHistoryItem[]>([]);

  // Harry Potter houses
  const houses = ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"];

  // Spells depending on correct answers
  const spells = [
    "Expecto Patronum! ✨",
    "Expelliarmus! ⚡",
    "Wingardium Leviosa! 🍃",
    "Lumos! 💡",
    "Alohomora! 🔑"
  ];

  const generateQuestion = () => {
    let n1 = 0;
    let n2 = 0;
    let op = "+";
    
    // Choose operator based on level
    const ops = level === 1 ? ["+"] : level === 2 ? ["+", "-"] : ["+", "-", "*"];
    op = ops[Math.floor(Math.random() * ops.length)];

    if (op === "+") {
      n1 = Math.floor(Math.random() * (15 * level)) + 5;
      n2 = Math.floor(Math.random() * (15 * level)) + 5;
    } else if (op === "-") {
      n1 = Math.floor(Math.random() * (20 * level)) + 10;
      n2 = Math.floor(Math.random() * n1); // Positive result
    } else {
      n1 = Math.floor(Math.random() * 9) + 2;
      n2 = Math.floor(Math.random() * 9) + 2;
    }

    setNum1(n1);
    setNum2(n2);
    setOperator(op);

    // Calculate answer
    const ans = op === "+" ? n1 + n2 : op === "-" ? n1 - n2 : n1 * n2;

    // Generate option distractors
    const newOptions = new Set<number>();
    newOptions.add(ans);
    while (newOptions.size < 4) {
      const offset = Math.floor(Math.random() * 10) - 5;
      if (offset !== 0 && ans + offset >= 0) {
        newOptions.add(ans + offset);
      }
    }
    setOptions(Array.from(newOptions).sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    generateQuestion();
  }, [level]);

  const handleAnswer = (selected: number) => {
    const correctAnswer = operator === "+" ? num1 + num2 : operator === "-" ? num1 - num2 : num1 * num2;
    const isCorrect = selected === correctAnswer;

    const newHistoryItem: MathHistoryItem = {
      question: `${num1} ${operator} ${num2}`,
      userAnswer: selected.toString(),
      correctAnswer: correctAnswer.toString(),
      isCorrect,
    };

    setHistory((prev) => [newHistoryItem, ...prev.slice(0, 4)]);

    if (isCorrect) {
      setScore((s) => s + 10);
      setSpellPower((p) => Math.min(p + 15, 100));
      const randomSpell = spells[Math.floor(Math.random() * spells.length)];
      setSpellEffect(randomSpell);
      setFeedback("Зөв хариуллаа! Маш сайн.");
      
      if (score > 0 && (score + 10) % 40 === 0) {
        setLevel((l) => Math.min(l + 1, 3));
        setFeedback("Баяр хүргэе! Математикийн түвшин ахилаа.");
      }
    } else {
      setSpellPower((p) => Math.max(p - 20, 0));
      setFeedback("Буруу хариуллаа. Дахин оролдоорой!");
      if (spellPower <= 20) {
        setFeedback("Шидэт хүч дууслаа! Дахин шинээр эхэлж байна.");
        setSpellPower(100);
        setScore(0);
        setLevel(1);
      }
    }

    // Generate next question
    setTimeout(() => {
      setSpellEffect(null);
      generateQuestion();
    }, 1500);
  };

  const handleHouseChange = (house: string) => {
    setHarryPotterHouse(house);
    setSpellPower(100);
    setScore(0);
    setLevel(1);
    setFeedback(`${house} тэнхимд нэгдлээ! Таны танин мэдэхүйн аялал эхэллээ.`);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-heading italic text-2xl text-white">Math Wizardry Quiz</h4>
          <p className="text-xs text-white/60 font-body">Гарри Поттер тэнхим болон Математикийн шидэт бодлого</p>
        </div>
        <div className="flex gap-2">
          {houses.map((house) => (
            <button
              key={house}
              onClick={() => handleHouseChange(house)}
              className={`px-3 py-1 rounded-full text-xs font-body transition-all ${
                harryPotterHouse === house
                  ? "bg-white text-black font-semibold shadow"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {house}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Game Area */}
        <div className="md:col-span-2 liquid-glass rounded-2xl p-6 flex flex-col justify-between min-h-[280px]">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-white/60 uppercase tracking-widest">
              Түвшин {level}: {operator === "+" ? "Нэмэх" : operator === "-" ? "Хасах" : "Үржих"}
            </span>
            <span className="text-xs font-mono text-white/60 uppercase">
              Оноо: <strong className="text-white text-sm">{score}</strong>
            </span>
          </div>

          <div className="my-6 text-center relative flex flex-col items-center justify-center">
            {/* Answer feedback overlay */}
            <AnimatePresence>
              {spellEffect && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, y: -20 }}
                  animate={{ scale: 1.2, opacity: 1, y: -45 }}
                  exit={{ scale: 0.8, opacity: 0, y: -60 }}
                  className="absolute text-xl md:text-2xl font-bold font-heading text-yellow-300 z-20 pointer-events-none drop-shadow"
                >
                  {spellEffect}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-5xl md:text-6xl font-heading italic tracking-tight text-white mb-2 selection:bg-none">
              {num1} {operator} {num2} = ?
            </div>
            
            {feedback && (
              <span className="text-xs text-white/80 font-body bg-white/5 px-3 py-1 rounded-full">
                {feedback}
              </span>
            )}
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-2 gap-3">
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                disabled={!!spellEffect}
                className="liquid-glass hover:bg-white/10 text-white font-body text-base py-3 rounded-xl transition-all active:scale-95 text-center cursor-pointer"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Wizard Panel */}
        <div className="liquid-glass rounded-2xl p-6 flex flex-col justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-white/60 uppercase tracking-widest block mb-2">
              Шидтэний Төлөв
            </span>
            
            {/* House Flag Card */}
            <div className={`p-4 rounded-xl text-center mb-4 transition-colors ${
              harryPotterHouse === "Gryffindor" ? "bg-red-950/40 border border-red-800/30" :
              harryPotterHouse === "Slytherin" ? "bg-emerald-950/40 border border-emerald-800/30" :
              harryPotterHouse === "Ravenclaw" ? "bg-blue-950/40 border border-blue-800/30" :
              "bg-amber-950/40 border border-amber-800/30"
            }`}>
              <div className="text-2xl font-heading italic text-white">{harryPotterHouse}</div>
              <div className="text-[10px] text-white/50 uppercase mt-1">Одоогийн Тэнхим</div>
            </div>

            {/* Spell Energy bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>Шидэт Хүчин (Mana)</span>
                <span>{spellPower}%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-400 h-full"
                  animate={{ width: `${spellPower}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Spell Quest History */}
          <div>
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 border-b border-white/5 pb-1">
              Сүүлийн Туршилтууд
            </div>
            <div className="flex flex-col gap-1.5">
              {history.length === 0 ? (
                <div className="text-xs text-white/30 italic">Асуултанд хариулж шид бүтээ...</div>
              ) : (
                history.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span className="text-white/70 font-mono">{item.question}</span>
                    <span className={item.isCorrect ? "text-emerald-400" : "text-rose-400"}>
                      {item.isCorrect ? "Зөв ✓" : `Буруу (${item.userAnswer})`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
