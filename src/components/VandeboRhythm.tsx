import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Beat {
  id: number;
  track: number; // 0, 1, 2, 3
  y: number; // 0 to 100%
  hit: boolean;
  missed: boolean;
}

export default function VandeboRhythm() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [selectedSong, setSelectedSong] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackColor, setFeedbackColor] = useState("text-white");
  const [beats, setBeats] = useState<Beat[]>([]);
  const gameLoopRef = useRef<number | null>(null);
  const beatIdRef = useRef(0);

  const songs = [
    { title: "Too Deep", tempo: 115, difficulty: "Дундаж", desc: "Vandebo-ийн сэтгэл хөдөлгөм, гүн уянгалаг хэмнэлтэй дуу" },
    { title: "Haru Haru", tempo: 130, difficulty: "Хэцүү", desc: "Эрч хүчтэй, хурдан хэмнэлтэй сонсогчдын дуртай бүтээл" }
  ];

  const keys = ["D", "F", "J", "K"];

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setFeedback("Эхэллээ! D, F, J, K товчлууруудыг ашиглаарай.");
    setFeedbackColor("text-white");
    setBeats([]);
    beatIdRef.current = 0;
  };

  const stopGame = () => {
    setIsPlaying(false);
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      const keyUpper = e.key.toUpperCase();
      const trackIdx = keys.indexOf(keyUpper);
      if (trackIdx !== -1) {
        checkHit(trackIdx);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, beats]);

  // Main Game Loop for beat falling
  useEffect(() => {
    if (!isPlaying) return;

    let lastBeatTime = performance.now();
    const beatInterval = 1000 / (songs[selectedSong].tempo / 60); // beats per second

    const updateGame = (now: number) => {
      // 1. Spawning new beats
      if (now - lastBeatTime > beatInterval) {
        const randomTracksCount = Math.random() > 0.75 ? 2 : 1;
        const chosenTracks = new Set<number>();
        while (chosenTracks.size < randomTracksCount) {
          chosenTracks.add(Math.floor(Math.random() * 4));
        }

        const newBeats: Beat[] = Array.from(chosenTracks).map((track) => ({
          id: beatIdRef.current++,
          track,
          y: 0,
          hit: false,
          missed: false,
        }));

        setBeats((prev) => [...prev, ...newBeats]);
        lastBeatTime = now;
      }

      // 2. Moving existing beats
      setBeats((prev) => {
        return prev
          .map((beat) => {
            if (beat.hit) return beat;
            const nextY = beat.y + 1.2 * (selectedSong + 1); // speed up with harder songs
            
            // If the beat moves past the hit line (say 90%) and hasn't been hit, it's a miss
            if (nextY >= 95 && !beat.missed) {
              setCombo(0);
              setFeedback("Алдлаа! (MISS)");
              setFeedbackColor("text-rose-400");
              return { ...beat, y: nextY, missed: true };
            }
            return { ...beat, y: nextY };
          })
          .filter((beat) => beat.y < 105); // Cleanup beats offscreen
      });

      gameLoopRef.current = requestAnimationFrame(updateGame);
    };

    gameLoopRef.current = requestAnimationFrame(updateGame);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPlaying, selectedSong]);

  const checkHit = (track: number) => {
    // Find closest beat in this track that is in the hit zone (75% to 93%)
    setBeats((currentBeats) => {
      let hitCompleted = false;
      const updated = currentBeats.map((beat) => {
        if (beat.track === track && !beat.hit && !beat.missed && beat.y >= 70 && beat.y <= 95) {
          hitCompleted = true;
          // Calculate score based on timing precision
          const dev = Math.abs(beat.y - 85);
          let points = 5;
          let rating = "БОЛОМЖИЙН";
          let color = "text-blue-300";

          if (dev <= 4) {
            points = 20;
            rating = "ТУЙЛЫН ЗӨВ! 🔥";
            color = "text-yellow-300";
          } else if (dev <= 8) {
            points = 12;
            rating = "МАШ САЙН! ✨";
            color = "text-emerald-300";
          }

          setScore((s) => s + points);
          setCombo((c) => {
            const nextC = c + 1;
            if (nextC > maxCombo) setMaxCombo(nextC);
            return nextC;
          });
          setFeedback(rating);
          setFeedbackColor(color);

          return { ...beat, hit: true };
        }
        return beat;
      });

      if (!hitCompleted) {
        // If they pressed but missed
        setFeedback("Буруу Даралт! ✕");
        setFeedbackColor("text-red-500");
        setCombo(0);
      }

      return updated;
    });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h4 className="font-heading italic text-2xl text-white">VANDEBO Rhythm Beats</h4>
          <p className="text-xs text-white/60 font-body">Вандебо хамтлагийн уран бүтээлийн хэмнэл дагах тоглоом</p>
        </div>
        
        {!isPlaying ? (
          <div className="flex gap-2">
            {songs.map((song, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSong(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-body transition-all cursor-pointer ${
                  selectedSong === idx
                    ? "bg-white text-black font-semibold"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {song.title}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <span className="text-sm font-mono text-white">Дуу: <strong className="text-yellow-300 font-heading italic text-lg">{songs[selectedSong].title}</strong></span>
            <button
              onClick={stopGame}
              className="bg-red-500 hover:bg-red-600 text-white font-body text-xs px-3 py-1.5 rounded-full cursor-pointer"
            >
              Тоглоомыг зогсоох
            </button>
          </div>
        )}
      </div>

      {!isPlaying ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 liquid-glass p-6 rounded-2xl flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-white/50">Сонгосон дууны тухай</span>
              <h5 className="font-heading italic text-3xl text-white mt-2">{songs[selectedSong].title}</h5>
              <p className="text-xs text-white/70 font-body mt-2 leading-relaxed">
                {songs[selectedSong].desc} <br />
                Темпо ая: <span className="text-white font-semibold">{songs[selectedSong].tempo} BPM</span> | Хүндрэл: <span className="text-yellow-300">{songs[selectedSong].difficulty}</span>
              </p>
            </div>
            
            <button
              onClick={startGame}
              className="mt-6 bg-white hover:bg-white/90 text-black py-3 rounded-xl font-bold font-body text-sm text-center transition-all cursor-pointer shadow hover:scale-102 active:scale-95"
            >
              ХЭМНЭЛИЙГ ЭХЛҮҮЛЭХ
            </button>
          </div>

          <div className="liquid-glass p-6 rounded-2xl flex flex-col justify-center text-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-white/50">Дүрмийн Заавар</span>
            <p className="text-xs text-white/80 font-body leading-relaxed max-w-xs mx-auto">
              Дэлгэц дээр бууж буй хэмнэлийн бөмбөлгийг доорх <strong className="text-white">Онох Зурваст</strong> хүрэх үед тохирох товчлуур (<strong className="text-white">D, F, J, K</strong>)-ыг гар дээрээсээ яг цагт нь дараарай!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Game Track Area */}
          <div className="md:col-span-3 liquid-glass rounded-2xl p-4 flex flex-col items-center">
            
            {/* Tracks columns container */}
            <div className="w-full max-w-sm h-[320px] bg-black/60 rounded-xl relative overflow-hidden border border-white/10 flex">
              
              {/* Vertical Dividers */}
              {[1, 2, 3].map((x) => (
                <div key={x} className="absolute h-full w-[1px] bg-white/5" style={{ left: `${x * 25}%` }} />
              ))}

              {/* Beats Rendering Area */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                {beats.map((beat) => {
                  if (beat.hit) return null;
                  return (
                    <motion.div
                      key={beat.id}
                      className="absolute w-10 h-10 -ml-5 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500 shadow-lg border border-white/20 flex items-center justify-center text-[10px] text-white font-bold"
                      style={{
                        left: `${beat.track * 25 + 12.5}%`,
                        top: `${beat.y}%`,
                      }}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                    >
                      {keys[beat.track]}
                    </motion.div>
                  );
                })}
              </div>

              {/* Falling target track lists */}
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  onClick={() => checkHit(idx)}
                  className="w-1/4 h-full flex flex-col justify-end items-center pb-12 cursor-pointer hover:bg-white/2 active:bg-white/5 transition-all"
                >
                  {/* The key label inside track */}
                  <span className="text-white/30 font-semibold font-mono text-sm mb-1">{keys[idx]}</span>
                </div>
              ))}

              {/* HIT Target Line Indicator at Y=85% */}
              <div
                className="absolute left-0 w-full h-[3px] bg-yellow-400/30 border-t border-b border-yellow-400/60 pointer-events-none"
                style={{ top: "85%" }}
              />
            </div>

            {/* Tap controls for mobile / mouse click users */}
            <div className="grid grid-cols-4 gap-3 w-full max-w-sm mt-4">
              {keys.map((key, idx) => (
                <button
                  key={key}
                  onClick={() => checkHit(idx)}
                  className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-semibold select-none cursor-pointer"
                >
                  {key}
                </button>
              ))}
            </div>

          </div>

          {/* Side stats & performance indicator */}
          <div className="liquid-glass rounded-2xl p-6 flex flex-col justify-between text-center md:text-left h-full min-h-[220px]">
            <div>
              <span className="text-[10px] font-mono text-white/50 tracking-widest uppercase">Үнэлгээ</span>
              
              <div className="my-4 h-12 flex items-center justify-center md:justify-start">
                <span className={`text-lg font-body font-bold tracking-tight ${feedbackColor}`}>
                  {feedback}
                </span>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <div className="flex justify-between items-center bg-white/3 p-2 rounded-lg">
                  <span className="text-xs text-white/60">Нийт оноо</span>
                  <span className="font-heading italic text-xl text-yellow-300">{score}</span>
                </div>
                <div className="flex justify-between items-center bg-white/3 p-2 rounded-lg">
                  <span className="text-xs text-white/60">Одоогийн Combo</span>
                  <span className="font-body font-bold text-base text-violet-400">{combo}</span>
                </div>
                <div className="flex justify-between items-center bg-white/3 p-2 rounded-lg">
                  <span className="text-xs text-white/60">Макс Combo</span>
                  <span className="font-body font-bold text-sm text-lime-400">{maxCombo}</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-white/40 leading-normal mt-4 border-t border-white/5 pt-2">
              Гар ашиглаж байгаа бол гарны <strong className="text-white">D, F, J, K</strong> дараарай.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
