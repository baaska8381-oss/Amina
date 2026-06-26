import React, { useEffect, useRef } from "react";

interface FadingVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  targetOpacity?: number;
}

export default function FadingVideo({ src, className, style, targetOpacity = 1 }: FadingVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const fadingOutRef = useRef<boolean>(false);

  const fadeTo = (toOpacity: number, duration: number) => {
    const video = videoRef.current;
    if (!video) return;

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    const startOpacity = parseFloat(video.style.opacity || "0");
    const opacityDiff = toOpacity - startOpacity;
    if (opacityDiff === 0) return;

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentOpacity = startOpacity + opacityDiff * progress;
      video.style.opacity = currentOpacity.toFixed(4);

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(animate);
      } else {
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.style.opacity = "0";
    fadingOutRef.current = false;

    const handleLoadedData = () => {
      video.style.opacity = "0";
      fadingOutRef.current = false;
      video.play().catch((e) => console.log("Video play error:", e));
      fadeTo(targetOpacity, 500);
    };

    const handleTimeUpdate = () => {
      if (!fadingOutRef.current && video.duration && video.currentTime) {
        const timeLeft = video.duration - video.currentTime;
        // FADE_MS = 500, FADE_OUT_LEAD = 0.55 seconds.
        if (timeLeft <= 0.55 && timeLeft > 0) {
          fadingOutRef.current = true;
          fadeTo(0, 500);
        }
      }
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      // After setTimeout 100ms reset currentTime = 0, play(), clear fadingOutRef, fadeTo(targetOpacity)
      setTimeout(() => {
        if (!video) return;
        video.currentTime = 0;
        video.play().catch((e) => console.log("Video reset play error:", e));
        fadingOutRef.current = false;
        fadeTo(targetOpacity, 500);
      }, 100);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    // If already loaded
    if (video.readyState >= 2) {
      handleLoadedData();
    }

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [src, targetOpacity]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      style={{ ...style, opacity: 0 }}
      muted
      playsInline
      autoPlay
      preload="auto"
    />
  );
}
