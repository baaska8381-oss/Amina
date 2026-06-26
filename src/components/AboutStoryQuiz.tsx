import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Question {
  q: string;
  options: string[];
  answer: string;
  fact: string;
}

export default function AboutStoryQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showFact, setShowFact] = useState(false);

  const questions: Question[] = [
    {
      q: "Амин-Одын бүтэн нэр хэн бэ?",
      options: ["Амин-Эрдэнэ", "Амин-Од", "Аминаа", "Одгэрэл"],
      answer: "Амин-Од",
      fact: "Миний нэрийг Амин-Од гэдэг."
    },
    {
      q: "Амин-Од одоо хэдэн настай вэ?",
      options: ["12 настай", "13 настай", "14 настай", "15 настай"],
      answer: "14 настай",
      fact: "Би одоо 14 настай."
    },
    {
      q: "Тэрээр аль сургуулийн сонгоны ангид суралцдаг вэ?",
      options: ["1-р сургууль", "11-р сургууль", "62-р сургууль", "Орос 3-р сургууль"],
      answer: "62-р сургууль",
      fact: "Би 62-р сургуулийн сонгоны ангид суралцдаг."
    },
    {
      q: "Амин-Одын чөлөөт цагаараа тоглох хамгийн дуртай спорт юу вэ?",
      options: ["Сагсан бөмбөг", "Гар бөмбөг (Волейбол)", "Ширээний теннис", "Хөлбөмбөг"],
      answer: "Гар бөмбөг (Волейбол)",
      fact: "Би волейболын спортоор хичээллэх, тоглох маш их дуртай."
    },
    {
      q: "Түүний хамгийн дуртай, байнга сонсдог хамтлаг аль нь вэ?",
      options: ["The Colors", "VANDEBO", "Vanquish", "Guys"],
      answer: "VANDEBO",
      fact: "Миний сонсох дуртай хамтлаг бол VANDEBO юм."
    },
    {
      q: "Амин-Одын шимтэн уншдаг алдартай уран сэтгэмжит ном юу вэ?",
      options: ["Перси Жексон", "Гарри Поттер (Harry Potter)", "Бөгжний Эзэн", "Шерлок Холмс"],
      answer: "Гарри Поттер (Harry Potter)",
      fact: "Би шидэт ертөнцийн тухай өгүүлэх HARRY POTTER номыг шимтэн уншдаг."
    },
    {
      q: "Хичээлүүдээс хамгийн дуртай бөгөөд логик сэтгэлгээ шаардсан хичээл нь юу вэ?",
      options: ["Мэдээлэл зүй", "Физик", "Философи", "Математик (Math)"],
      answer: "Математик (Math)",
      fact: "Дуртай хичээл маань MATH буюу Математикийн хичээл юм."
    },
    {
      q: "Тэрээр ямар гадаад хэлээр чөлөөтэй ярьж чаддаг вэ?",
      options: ["Хятад хэл", "Орос хэл", "Япон хэл", "Солонгос хэл"],
      answer: "Орос хэл",
      fact: "Би Орос хэлээр чөлөөтэй ярьж чаддаг."
    },
    {
      q: "Амин-Одын ирээдүйд болохыг хүсдэг хамгийн том мөрөөдлийн мэргэжил юу вэ?",
      options: ["Эмч", "Сансрын нисгэгч", "IT инженер (IT Engineer)", "Архитектор"],
      answer: "IT инженер (IT Engineer)",
      fact: "Би ирээдүйд шилдэг IT ENGINEER болохыг хүсэж, одооноос урдаж байна."
    },
    {
      q: "Амин-Од гэр бүлийнхээ хэд дэх хүүхэд вэ?",
      options: ["Айлын ганц хүүхэд", "Айлын отгон охин", "Айлын дунд охин", "Айлын том охин"],
      answer: "Айлын том охин",
      fact: "Би айлын хамгийн том, хариуцлагатай охин юм."
    }
  ];

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === questions[currentIdx].answer) {
      setScore(score + 10);
    }
    setShowFact(true);
  };

  const handleNext = () => {
    setShowFact(false);
    setIsAnswered(false);
    setSelectedOption(null);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizFinished(false);
    setShowFact(false);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Quiz Area Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h4 className="font-heading italic text-2xl text-white">Та Амин-Одыг хэр сайн мэдэх вэ?</h4>
          <p className="text-xs text-white/50 font-body">Түүний сонирхол, мөрөөдлийг харуулсан 10 асуулт ба хариулт</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-white/40 block">Зөв хариулт</span>
          <span className="font-heading italic text-xl text-yellow-300">{score} оноо</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!quizFinished ? (
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-6"
          >
            {/* Question column */}
            <div className="lg:col-span-3 liquid-glass p-6 rounded-2xl flex flex-col justify-between min-h-[300px]">
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1">
                  Асуулт {currentIdx + 1} / {questions.length}
                </span>
                <h5 className="font-heading italic text-2xl md:text-3xl text-white leading-tight mt-2 select-none">
                  {questions[currentIdx].q}
                </h5>
              </div>

              {/* Status or Success Feedback */}
              <div className="mt-4">
                <AnimatePresence>
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-xl text-xs font-body ${
                        selectedOption === questions[currentIdx].answer
                          ? "bg-emerald-950/30 border border-emerald-800/30 text-emerald-300"
                          : "bg-rose-950/30 border border-rose-800/30 text-rose-300"
                      }`}
                    >
                      {selectedOption === questions[currentIdx].answer ? (
                        <span>✓ Зөв хариуллаа! Та түүнийг маш сайн мэддэг бололтой.</span>
                      ) : (
                        <span>
                          ✕ Буруу хариуллаа. Зөв хариулт нь:{" "}
                          <strong className="underline text-white font-semibold">
                            {questions[currentIdx].answer}
                          </strong>
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Next Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!isAnswered}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold font-body tracking-wider transition-all uppercase flex items-center gap-1.5 ${
                    isAnswered
                      ? "bg-white text-black hover:bg-neutral-200 cursor-pointer hover:scale-102 active:scale-95"
                      : "bg-white/5 text-white/30 cursor-not-allowed"
                  }`}
                >
                  <span>{currentIdx === questions.length - 1 ? "Төгсгөх" : "Дараагийн асуулт"}</span>
                  <span className="font-sans">→</span>
                </button>
              </div>
            </div>

            {/* Options Columns */}
            <div className="lg:col-span-2 flex flex-col gap-3 justify-center">
              {questions[currentIdx].options.map((option, idx) => {
                let btnStyle = "liquid-glass text-white/90 hover:bg-white/5 hover:scale-101";
                if (isAnswered) {
                  if (option === questions[currentIdx].answer) {
                    btnStyle = "bg-emerald-500/20 border-emerald-400 text-emerald-200";
                  } else if (option === selectedOption) {
                    btnStyle = "bg-rose-500/20 border-rose-400 text-rose-200";
                  } else {
                    btnStyle = "opacity-40 border-dashed";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(option)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-xl text-sm font-body border border-white/10 transition-all select-none ${
                      !isAnswered ? "cursor-pointer active:scale-98" : ""
                    } ${btnStyle}`}
                  >
                    <span>{option}</span>
                  </button>
                );
              })}

              {/* Fact overlay on the right */}
              <AnimatePresence>
                {showFact && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="mt-2 text-center p-3 border border-white/5 rounded-xl bg-white/2"
                  >
                    <span className="text-[10px] font-mono uppercase text-white/40 tracking-widest block mb-1">
                      Миний хувийн баримт (Fact)
                    </span>
                    <p className="text-xs text-white/80 font-body italic">
                      "{questions[currentIdx].fact}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="finish"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-10 liquid-glass rounded-2xl p-8"
          >
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl mb-4 text-yellow-300">
              🏆
            </div>
            <h5 className="font-heading italic text-3xl text-white mb-2">Аялал Амжилттай Дууслаа!</h5>
            <p className="text-sm text-white/70 font-body max-w-sm ml-auto mr-auto leading-relaxed mb-6">
              Сорилтыг амжилттай дуусгалаа. Сансрын зочин та Амин-Одын тухай асуултуудад маш сайн хариулж, нийт{" "}
              <strong className="text-yellow-300 text-base">{score} / 100</strong> оноо авлао.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={restartQuiz}
                className="bg-white hover:bg-neutral-100 text-black py-2.5 px-6 rounded-full font-bold font-body text-xs cursor-pointer tracking-wider"
              >
                Дахин Оролдох
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
