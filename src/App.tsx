import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import FadingVideo from "./components/FadingVideo";
import BlurText from "./components/BlurText";
import MathGame from "./components/MathGame";
import VandeboRhythm from "./components/VandeboRhythm";
import VolleyballSpiker from "./components/VolleyballSpiker";
import AboutStoryQuiz from "./components/AboutStoryQuiz";
import IdolCoach from "./components/IdolCoach";
import AminaHelper from "./components/AminaHelper";
import AnimeEmojiGame from "./components/AnimeEmojiGame";
import {
  ArrowUpRightIcon,
  PlayIcon,
  ClockIcon,
  GlobeIcon,
} from "./components/Icons";

// Suppress benign warnings
if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0] && typeof args[0] === "string" && args[0].includes("React does not recognize")) return;
    if (args[0] && typeof args[0] === "string" && args[0].includes("Framer Motion")) return;
    originalError(...args);
  };
}

export default function App() {
  const [activeGame, setActiveGame] = useState<"none" | "math" | "rhythm" | "volleyball" | "anime">("none");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Entrance animations for general items in the Hero
  const heroEntrance = {
    hidden: { filter: "blur(10px)", opacity: 0, y: 20 },
    visible: (delay: number) => ({
      filter: "blur(0px)",
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };

  // Amin-Od's Story Cards data based on prompt requirements
  const storyCards = [
    {
      icon: "💻",
      title: "Ирээдүйн IT Инженер",
      tags: ["IT Engineer", "Coding", "Problem Solving", "62-р сургууль"],
      desc: "62-р сургуулийн сонгоны ангийн сурагч бөгөөд технологи, програм хангамж, алгоритмд маш их сонирхолтой. Ирээдүйд шилдэг IT Инженер болно.",
    },
    {
      icon: "🏐",
      title: "Воллейболын Довтлогч",
      tags: ["Volleyball", "Team Play", "Spike", "Athletic"],
      desc: "Багийн хамтын ажиллагаа, хурд, тэсвэр тэвчээр шаардсан воллейболын спортоор хичээллэж, эрч хүчтэй байх дуртай.",
    },
    {
      icon: "🪄",
      title: "Унших Дуртай Ном",
      tags: ["Harry Potter", "Fantasy", "Magic", "Gryffindor"],
      desc: "Шидэт ертөнцийн гайхамшиг болох Харри Поттер номын үнэнч уншигч. Өөрийн танин мэдэхүйн ертөнцөд шинэ адал явдал хайгч.",
    },
    {
      icon: "📐",
      title: "Дуртай Хичээл — Математик",
      tags: ["Math", "Logic", "Selective Class", "Analytical"],
      desc: "Логик ухаан, нарийвчлалыг хөгжүүлдэг Математикийн хичээлдээ туйлын дуртай. Сонгоны ангийн даалгавруудыг таалан боддог.",
    },
    {
      icon: "🌐",
      title: "Хэлний Мэдлэгүүд",
      tags: ["English Learner", "Russian Speaker", "Global Student"],
      desc: "Орос хэлээр чөлөөтэй ярьж чаддаг төдийгүй дэлхийн орон зайд чөлөөтэй сэтгэхийн тулд Англи хэлийг шаргуу суралцаж байна.",
    },
    {
      icon: "👩‍👧‍👦",
      title: "Айлын Том Охин",
      tags: ["Oldest Sister", "Leader", "Caring", "Family first"],
      desc: "Гэр бүлийнхээ хайртай тулгуур, айлын том ухаалаг хариуцлагатай охин. Дүү нартаа зөв үлгэр дуурайлал үзүүлэх удирдагч чанар.",
    },
  ];

  return (
    <main className="w-full bg-black min-h-screen text-white relative">
      
      {/* Navbar (fixed top-4, px-8 / lg:px-16, z-50) */}
      <nav id="navbar" className="fixed top-4 left-0 right-0 px-4 md:px-8 lg:px-16 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left: 48x48 liquid-glass circle with italic serif lowercase "a" */}
          <button
            onClick={() => scrollToSection("hero")}
            className="w-12 h-12 rounded-full flex items-center justify-center liquid-glass cursor-pointer select-none font-heading text-2xl italic text-white/90 hover:scale-105 active:scale-95 transition-all"
            title="Amin-Od Space Hub"
          >
            a
          </button>

          {/* Center */}
          <div className="flex items-center liquid-glass rounded-full p-1.5 gap-1 shadow-2xl">
            <button
              onClick={() => scrollToSection("hero")}
              className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-white/90 font-body rounded-full hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              Эхлэл
            </button>
            <button
              onClick={() => scrollToSection("amin-od")}
              className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-white/60 font-body rounded-full hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              Амин-Одын Тухай
            </button>
            <button
              onClick={() => scrollToSection("interactive-arena")}
              className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-white/60 font-body rounded-full hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              Тоглоомын Цэс
            </button>
            <button
              onClick={() => scrollToSection("ebo-coach-section")}
              className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-white/60 font-body rounded-full hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              Ebo Coach
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-amina-chat"))}
              className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-pink-400 font-body rounded-full hover:bg-pink-500/10 hover:text-pink-300 transition-all cursor-pointer border border-pink-500/20"
            >
              Amina Helper ✨
            </button>
            <button
              onClick={() => scrollToSection("about-quiz-section")}
              className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-white/60 font-body rounded-full hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              Сорилт
            </button>

            {/* White pill button Claim a Spot + ArrowUpRight icon */}
            <button
              onClick={() => scrollToSection("interactive-arena")}
              className="ml-2 bg-white text-black px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold hover:bg-white/90 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <span>Тоглох Салон</span>
              <ArrowUpRightIcon className="h-3.5 w-3.5 stroke-black" />
            </button>
          </div>

          {/* Right: 48x48 invisible spacer to balance logo */}
          <div className="w-12 h-12 pointer-events-none opacity-0" />
        </div>
      </nav>

      {/* SECTION 1 — HERO (full viewport, black bg) */}
      <section
        id="hero"
        className="w-full min-h-screen relative overflow-hidden bg-black flex flex-col justify-between"
      >
        {/* Background video (120% width/height, top-aligned, centered horizontally) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <FadingVideo
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
            className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top"
            style={{ width: "120%", height: "120%" }}
            targetOpacity={0.6}
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-32 px-4 max-w-4xl mx-auto w-full text-center">
          
          {/* Badge (delay 0.4s) */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.4}
            variants={heroEntrance}
            className="liquid-glass rounded-full p-1.5 flex items-center gap-2 mb-6 max-w-full hover:scale-102 transition-transform duration-300"
          >
            <span className="bg-white text-black px-3.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider shadow">
              Амин-Од
            </span>
            <span className="text-white/90 text-[13px] md:text-sm font-body font-normal pr-3 truncate">
              62-р сургуулийн сонгоны анги • 14 настай
            </span>
          </motion.div>

          {/* Headline (word-by-word animation) */}
          <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-heading italic text-white leading-[0.85] max-w-3xl mb-4 tracking-[-4px] select-none">
            <BlurText text="АМИН-ОДЫН ЕРТӨНЦ" />
          </h1>

          {/* Subheading (delay 0.8s) */}
          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.8}
            variants={heroEntrance}
            className="text-sm md:text-base text-white/95 max-w-xl font-body font-light leading-snug tracking-wide text-center mt-4"
          >
            Сансар огторгуйг өөрийнхөөрөө судлах мөрөөдөлтэй. Математик, спорт болон IT технологид шимтэн суралцаж буй Амин-Одын дижитал ертөнц манай хуудсаар аялахад бэлэн боллоо.
          </motion.p>

          {/* CTAs (delay 1.1s) */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={1.1}
            variants={heroEntrance}
            className="flex items-center gap-6 mt-8"
          >
            <button
              onClick={() => scrollToSection("interactive-arena")}
              className="liquid-glass-strong rounded-full px-6 py-3 text-sm font-bold text-white flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xl group"
            >
              <span>Тоглоомын Цэс</span>
              <ArrowUpRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button
              onClick={() => scrollToSection("amin-od")}
              className="text-white hover:text-white/80 transition-colors font-body text-sm font-medium flex items-center gap-2 py-2 group cursor-pointer"
            >
              <span>Миний Тухай</span>
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all select-none">
                <PlayIcon className="h-3 w-3 fill-white ml-0.5" />
              </span>
            </button>
          </motion.div>

          {/* Stats row (delay 1.3s) */}
          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 mt-12 w-full max-w-md">
            
            {/* Card 1 */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={1.3}
              variants={heroEntrance}
              className="liquid-glass p-5 w-full sm:w-[220px] rounded-[1.25rem] flex flex-col justify-between text-left hover:scale-102 transition-transform duration-300"
            >
              <div className="text-white/80 mb-6">
                <ClockIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="font-heading italic text-4xl text-white tracking-[-1px] leading-none">
                  14 Нас
                </div>
                <div className="text-[10px] uppercase tracking-widest text-white/60 mt-2">
                  Амин-Одын Одоогийн Нас
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={1.4}
              variants={heroEntrance}
              className="liquid-glass p-5 w-full sm:w-[220px] rounded-[1.25rem] flex flex-col justify-between text-left hover:scale-102 transition-transform duration-300"
            >
              <div className="text-white/80 mb-6">
                <GlobeIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="font-heading italic text-4xl text-white tracking-[-1px] leading-none">
                  2 Гадаад Хэл
                </div>
                <div className="text-[10px] uppercase tracking-widest text-white/60 mt-2">
                  Орос ба Англи хэл
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Partners */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={1.5}
          variants={heroEntrance}
          className="relative z-10 flex flex-col items-center gap-4 pb-12 pt-4 px-4 text-center max-w-5xl mx-auto w-full"
        >
          <div className="liquid-glass rounded-full px-5 py-1.5 text-xs font-semibold text-white/80 uppercase tracking-widest font-body shadow-sm">
            Миний Сонсох Дуртай Хамтлаг
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 font-heading italic text-3xl md:text-4xl text-white tracking-tight mt-2 select-none">
            <span className="hover:text-yellow-300 transition-all cursor-default">V</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-yellow-300 transition-all cursor-default">A</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-yellow-300 transition-all cursor-default">N</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-yellow-300 transition-all cursor-default">D</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-yellow-300 transition-all cursor-default">E</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-yellow-300 transition-all cursor-default">B</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-yellow-300 transition-all cursor-default">O</span>
          </div>
        </motion.div>

      </section>

      {/* SECTION 2 — AMIN-OD (min-h-screen, black bg) */}
      <section
        id="amin-od"
        className="w-full min-h-screen relative overflow-hidden bg-black flex flex-col justify-center py-20"
      >
        {/* Background video */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <FadingVideo
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4"
            className="absolute inset-0 w-full h-full object-cover"
            targetOpacity={0.6}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 sm:px-8 md:px-16 lg:px-20 pt-16 flex flex-col justify-between w-full max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 30 }}
            whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <span className="text-sm font-body font-mono text-white/50 tracking-widest block uppercase mb-4">
              // Амин-Одын Онцлогууд
            </span>
            <h2 className="font-heading italic text-white text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.9] tracking-[-3px]">
              Амин-Одын<br />Ертөнцөөр
            </h2>
          </motion.div>

          {/* Six Cards Grid instead of Three */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 w-full">
            {storyCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ filter: "blur(10px)", opacity: 0, y: 30 }}
                whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                className="liquid-glass rounded-[1.25rem] p-6 min-h-[300px] flex flex-col justify-between hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 group cursor-default"
              >
                {/* Top Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="w-11 h-11 flex-shrink-0 rounded-[0.75rem] flex items-center justify-center liquid-glass text-xl">
                    {card.icon}
                  </div>

                  <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="liquid-glass rounded-full px-2.5 py-1 text-[10px] text-white/90 font-body whitespace-nowrap hover:bg-white/10 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Flex spacer */}
                <div className="flex-1" />

                {/* Bottom Card Elements */}
                <div className="mt-6">
                  <h3 className="font-heading italic text-white text-3xl tracking-[-1px] leading-none group-hover:translate-x-1 transition-transform">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-xs md:text-sm text-white/70 font-body font-light leading-snug">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 3 — INTERACTIVE GAME PORTAL */}
      <section
        id="interactive-arena"
        className="w-full min-h-screen relative overflow-hidden bg-black flex flex-col justify-center py-20 border-t border-white/5"
      >
        <div className="relative z-10 px-4 sm:px-8 md:px-16 lg:px-20 w-full max-w-7xl mx-auto flex flex-col">
          
          {/* Section Header */}
          <div className="max-w-3xl mb-12">
            <span className="text-sm font-body font-mono text-white/50 tracking-widest block uppercase mb-4">
              // Cosmic Play Ground
            </span>
            <h2 className="font-heading italic text-white text-5xl md:text-7xl leading-[0.9] tracking-[-3px]">
              Миний Тоглоомын Цэс
            </h2>
            <p className="text-sm md:text-base text-white/60 font-body font-light mt-4">
              Миний хамгийн дуртай сонирхол, мөрөөдлүүдэд суурилсан 3 төрлийн шинэлэг интерактив тоглоомоор наадаарай. Утсандаа ороход хялбар, сонирхолтой.
            </p>
          </div>

          {/* Tab Selector for games */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => setActiveGame("none")}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold font-body transition-all cursor-pointer ${
                activeGame === "none"
                  ? "bg-white text-black font-semibold tracking-wider"
                  : "liquid-glass text-white hover:bg-white/10"
              }`}
            >
              Цэсийг харуулах
            </button>
            <button
              onClick={() => setActiveGame("math")}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold font-body transition-all cursor-pointer ${
                activeGame === "math"
                  ? "bg-white text-black font-semibold tracking-wider"
                  : "liquid-glass text-white hover:bg-white/10"
              }`}
            >
              📐 Математик & Поттер (Math Quiz)
            </button>
            <button
              onClick={() => setActiveGame("rhythm")}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold font-body transition-all cursor-pointer ${
                activeGame === "rhythm"
                  ? "bg-white text-black font-semibold tracking-wider"
                  : "liquid-glass text-white hover:bg-white/10"
              }`}
            >
              ⚡ Vandebo Rhythm Beats
            </button>
            <button
              onClick={() => setActiveGame("volleyball")}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold font-body transition-all cursor-pointer ${
                activeGame === "volleyball"
                  ? "bg-white text-black font-semibold tracking-wider"
                  : "liquid-glass text-white hover:bg-white/10"
              }`}
            >
              🏐 Volleyball IT Spiker
            </button>
            <button
              onClick={() => setActiveGame("anime")}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold font-body transition-all cursor-pointer ${
                activeGame === "anime"
                  ? "bg-white text-black font-semibold tracking-wider animate-pulse"
                  : "liquid-glass text-white hover:bg-white/10 border border-pink-500/20"
              }`}
            >
              🏴‍☠️ Anime Emoji Trivia ✨
            </button>
          </div>

          {/* Play Field */}
          <div className="liquid-glass rounded-[1.5rem] p-6 min-h-[400px] flex items-center justify-center shadow-2xl">
            <AnimatePresence mode="wait">
              {activeGame === "none" && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full text-left"
                >
                  {/* Option 1 */}
                  <div className="liquid-glass p-6 rounded-2xl flex flex-col justify-between min-h-[220px]">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#d97706]">Сонгоны Анги</span>
                      <h4 className="font-heading italic text-2xl text-white mt-2">Математик & Гарри Поттер</h4>
                      <p className="text-xs text-white/70 font-body mt-2 leading-relaxed">
                        Сургууль 62-р сонгоны ангийн сурагчийн логик болон шидтэнүүдийн асуулт хосолсон оюун ухааны сорилт.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveGame("math")}
                      className="mt-6 border border-white/20 hover:bg-white hover:text-black py-2.5 rounded-xl font-bold font-body text-xs text-center transition-all cursor-pointer"
                    >
                      Шидэт Бодлого Тоглох
                    </button>
                  </div>

                  {/* Option 2 */}
                  <div className="liquid-glass p-6 rounded-2xl flex flex-col justify-between min-h-[220px]">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-violet-400">Дуртай Хамтлаг</span>
                      <h4 className="font-heading italic text-2xl text-white mt-2">Vandebo Rhythm Beats</h4>
                      <p className="text-xs text-white/70 font-body mt-2 leading-relaxed">
                        Вандебо хамтлагийн 'Too Deep', 'Haru Haru' гэсэн хит уран бүтээлүүдийн хэмнэл дагах товшдог тоглоом.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveGame("rhythm")}
                      className="mt-6 border border-white/20 hover:bg-white hover:text-black py-2.5 rounded-xl font-bold font-body text-xs text-center transition-all cursor-pointer"
                    >
                      Хэмнэл Буулгах
                    </button>
                  </div>

                  {/* Option 3 */}
                  <div className="liquid-glass p-6 rounded-2xl flex flex-col justify-between min-h-[220px]">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#06b6d4]">Мэргэжил & Спорт</span>
                      <h4 className="font-heading italic text-2xl text-white mt-2">Volleyball IT Spiker</h4>
                      <p className="text-xs text-white/70 font-body mt-2 leading-relaxed">
                        Ирээдүйн IT инженер болох мөрөөдөлтэй. Англи, Орос хэлнүүдийн IT нэр томьёонуудыг ашиглаж воллейболоор довтлох тоглоом.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveGame("volleyball")}
                      className="mt-6 border border-white/20 hover:bg-white hover:text-black py-2.5 rounded-xl font-bold font-body text-xs text-center transition-all cursor-pointer"
                    >
                      Вейбол тоглоом
                    </button>
                  </div>

                  {/* Option 4 */}
                  <div className="liquid-glass p-6 rounded-2xl flex flex-col justify-between min-h-[220px] border border-pink-500/10">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-pink-400 animate-pulse">Дуртай Сонирхол</span>
                      <h4 className="font-heading italic text-2xl text-white mt-2">Anime Emoji Trivia</h4>
                      <p className="text-xs text-white/70 font-body mt-2 leading-relaxed">
                        One Piece, Naruto, Demon Slayer зэрэг алдартай аниме бүтээлүүдийн эможи таавар, дуу, зураг хосолсон тоглоом.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveGame("anime")}
                      className="mt-6 border border-pink-500/20 bg-pink-500/10 hover:bg-pink-500 hover:text-white py-2.5 rounded-xl font-bold font-body text-xs text-center transition-all cursor-pointer"
                    >
                      Аниме Таавар Тоглох ✨
                    </button>
                  </div>
                </motion.div>
              )}

              {activeGame === "math" && (
                <motion.div
                  key="math-game"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full"
                >
                  <MathGame />
                </motion.div>
              )}

              {activeGame === "rhythm" && (
                <motion.div
                  key="rhythm-game"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full"
                >
                  <VandeboRhythm />
                </motion.div>
              )}

              {activeGame === "volleyball" && (
                <motion.div
                  key="volleyball-game"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full"
                >
                  <VolleyballSpiker />
                </motion.div>
              )}

              {activeGame === "anime" && (
                <motion.div
                  key="anime-game"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full"
                >
                  <AnimeEmojiGame />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* SECTION 3.5 — IDOL COACH EBO (Vandebo) */}
      <section
        id="ebo-coach-section"
        className="w-full min-h-screen relative overflow-hidden bg-black flex flex-col justify-center py-20 border-t border-white/5"
      >
        <div className="relative z-10 px-4 sm:px-8 md:px-16 lg:px-20 w-full max-w-7xl mx-auto flex flex-col">
          
          <div className="max-w-3xl mb-12">
            <span className="text-sm font-body font-mono text-violet-400 tracking-widest block uppercase mb-4 animate-pulse">
              // Vandebo Idol Coach
            </span>
            <h2 className="font-heading italic text-white text-5xl md:text-7xl leading-[0.9] tracking-[-3px]">
              Ebo Coach-той ярилц
            </h2>
            <p className="text-sm md:text-base text-white/60 font-body font-light mt-4">
              Хөгжим, зорилго болон амьдралын үнэ цэнэтэй туршлагаас хуваалцах Vandebo хамтлагийн Ebo (Бат-Эрдэнэ)-тэй шууд холбогдож, урам зориг аваарай!
            </p>
          </div>

          <div className="w-full shadow-2xl">
            <IdolCoach />
          </div>

        </div>
      </section>



      {/* SECTION 4 — ABOUT AMIN-OD 10 QUESTIONS QUIZ */}
      <section
        id="about-quiz-section"
        className="w-full min-h-screen relative overflow-hidden bg-black flex flex-col justify-center py-20 border-t border-white/5"
      >
        <div className="relative z-10 px-4 sm:px-8 md:px-16 lg:px-20 w-full max-w-7xl mx-auto flex flex-col">
          
          <div className="max-w-3xl mb-12">
            <span className="text-sm font-body font-mono text-white/50 tracking-widest block uppercase mb-4">
              // Trivia Challenge
            </span>
            <h2 className="font-heading italic text-white text-5xl md:text-7xl leading-[0.9] tracking-[-3px]">
              Асуулт Хариулт
            </h2>
            <p className="text-sm md:text-base text-white/60 font-body font-light mt-4">
              Миний тухай бүх баримтуудыг нэгтгэсэн 10 асуулттай интерактив сорилтыг бөглөж, өөрийгөө шалгаарай!
            </p>
          </div>

          <div className="liquid-glass rounded-[1.5rem] p-6 min-h-[400px] flex items-center justify-center shadow-2xl">
            <AboutStoryQuiz />
          </div>

        </div>
      </section>

      {/* Subtle footer */}
      <footer className="w-full text-center py-6 text-xs text-white/30 tracking-widest font-body uppercase border-t border-white/5 relative z-10 select-none bg-black/80 backdrop-blur">
        &copy; 2026 АМИН-ОД CO. ALL RIGHTS RESERVED. ВАНДЕБО, ВОЛЛЕЙБОЛ БОЛОН IT ЕРТӨНЦ
      </footer>

      {/* Floating global chat assistant */}
      <AminaHelper />
    </main>
  );
}
