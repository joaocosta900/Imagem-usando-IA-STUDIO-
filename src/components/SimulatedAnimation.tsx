import React, { useEffect, useRef, useState } from "react";
import { Download, Loader2, Play } from "lucide-react";

interface SimulatedAnimationProps {
  image: string;
  isPlaying: boolean;
  prompt: string;
  onTimeUpdate?: (time: number) => void;
  // Customizable simulated effects
  preset?: string;             // 'standard' | 'rain' | 'cosmic_stellar' | 'abyssal' | 'retro_vhs' | 'fire_ember'
  rippleIntensity?: number;    // 0.1 to 3.0
  speed?: number;              // 0.1 to 3.0
  particleSize?: number;       // 0.1 to 3.0
  toneFilter?: string;         // 'monochrome' | 'warm_amber' | 'deep_blue' | 'sepia' | 'acid_green'
  lensAberration?: boolean;
  scanlines?: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speedY: number;
  speedX: number;
  wobbleSpeed: number;
  wobbleRange: number;
  wobbleOffset: number;
  color?: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

interface MistCloud {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  targetX: number;
  targetY: number;
  speed: number;
}

export function SimulatedAnimation({
  image,
  isPlaying,
  prompt,
  onTimeUpdate,
  preset = "standard",
  rippleIntensity = 1.0,
  speed = 1.0,
  particleSize = 1.0,
  toneFilter = "monochrome",
  lensAberration = true,
  scanlines = false,
}: SimulatedAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState<number>(0);
  const timeRef = useRef<number>(0);

  // Image loading states
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Video recording states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Pre-load the image to render inside Canvas
  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error("Erro ao carregar a imagem base no canvas.");
    };
    img.src = image;
  }, [image]);

  // Keep track of loop time (0 to 8 seconds)
  useEffect(() => {
    if (!isPlaying && !isRecording) return;

    let lastTime = performance.now();
    let animationFrameId: number;

    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Adjust delta based on custom user speed setting
      const adjustedDelta = delta * speed;
      let nextTime = timeRef.current + adjustedDelta;

      if (isRecording) {
        setRecordingTime(nextTime);
        if (nextTime >= 8.0) {
          // End recording exactly at 8.0 seconds
          if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
          }
          nextTime = 0;
          setIsRecording(false);
        }
      } else if (nextTime >= 8.0) {
        nextTime = 0; // loop
      }

      timeRef.current = nextTime;
      setTime(nextTime);
      onTimeUpdate?.(nextTime);

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, isRecording, speed, onTimeUpdate]);

  // Handle canvas resize and animations
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // Initialize particles based on preset and particleSize scaling
    let pCount = 35;
    if (preset === "rain") pCount = 65;
    else if (preset === "cosmic_stellar") pCount = 50;
    else if (preset === "abyssal") pCount = 20;
    else if (preset === "fire_ember") pCount = 45;
    else if (preset === "retro_vhs") pCount = 25;

    pCount = Math.round(pCount * particleSize);

    const particles: Particle[] = Array.from({ length: pCount }, () => {
      const isRain = preset === "rain";
      const isEmber = preset === "fire_ember";
      const isStellar = preset === "cosmic_stellar";

      // Different speed characteristics depending on preset
      let speedY = -(Math.random() * 15 + 5); // Default slow upward drift
      let speedX = (Math.random() * 6 - 3);

      if (isRain) {
        speedY = (Math.random() * 150 + 350); // fast downward fall
        speedX = -(Math.random() * 40 + 30); // downward-left slant
      } else if (isEmber) {
        speedY = -(Math.random() * 30 + 15); // faster upward spark drift
        speedX = (Math.random() * 12 - 6);
      } else if (isStellar) {
        speedY = -(Math.random() * 10 + 3); // very slow majestic star rise
        speedX = (Math.random() * 4 - 2);
      }

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: (Math.random() * 1.5 + 0.5) * (isStellar ? 1.4 : 1.0),
        alpha: Math.random() * 0.4 + 0.1,
        speedY,
        speedX,
        wobbleSpeed: Math.random() * 2 + 0.5,
        wobbleRange: isRain ? 2 : (Math.random() * 15 + 5),
        wobbleOffset: Math.random() * Math.PI * 2,
      };
    });

    // Initialize concentric ripples (simulated center of hand at 45% X, 55% Y)
    const ripples: Ripple[] = [];
    let lastRippleTime = 0;

    // Initialize drifting mist clouds
    const isDarkMist = preset === "abyssal" || preset === "standard" || preset === "retro_vhs";
    const mistClouds: MistCloud[] = Array.from({ length: isDarkMist ? 5 : 2 }, () => {
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      return {
        x: startX,
        y: startY,
        radiusX: Math.random() * 150 + 100,
        radiusY: Math.random() * 100 + 80,
        targetX: Math.random() * width,
        targetY: Math.random() * height,
        speed: Math.random() * 5 + 2, // pixels per second
      };
    });

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        width = canvas.width = entry.contentRect.width;
        height = canvas.height = entry.contentRect.height;
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    let lastTime = performance.now();

    const draw = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Adjust delta based on speed parameter
      const adjustedDelta = delta * speed;

      // Draw background color
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      // Draw the image with smooth zoom (2%) over 8.0s limit
      const img = imageRef.current;
      const currentScale = (isPlaying || isRecording) ? 1.0 + (timeRef.current / 8.0) * 0.02 : 1.0;

      if (img && imageLoaded) {
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.scale(currentScale, currentScale);

        // object-fit: contain emulation
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = width / height;
        let drawW = width;
        let drawH = height;
        if (canvasRatio > imgRatio) {
          drawW = height * imgRatio;
          drawH = height;
        } else {
          drawW = width;
          drawH = width / imgRatio;
        }

        // Apply advanced aesthetic filters based on toneFilter prop
        let filterStr = "contrast(1.1) brightness(0.95) grayscale(100%)"; // fallback
        if (toneFilter === "monochrome") {
          filterStr = "contrast(1.12) brightness(0.95) grayscale(100%)";
        } else if (toneFilter === "warm_amber") {
          filterStr = "contrast(1.05) brightness(0.92) sepia(40%) saturate(145%) hue-rotate(-15deg)";
        } else if (toneFilter === "deep_blue") {
          filterStr = "contrast(1.12) brightness(0.85) grayscale(40%) sepia(15%) hue-rotate(185deg) saturate(175%)";
        } else if (toneFilter === "sepia") {
          filterStr = "contrast(0.95) brightness(0.88) sepia(85%) saturate(75%)";
        } else if (toneFilter === "acid_green") {
          filterStr = "contrast(1.15) brightness(0.88) grayscale(75%) sepia(45%) hue-rotate(75deg) saturate(190%)";
        }
        
        ctx.filter = filterStr;

        // Draw image (with optional chromatic aberration blur effect)
        if (lensAberration) {
          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
          ctx.save();
          ctx.globalAlpha = 0.22;
          ctx.globalCompositeOperation = "screen";
          ctx.filter = filterStr + " blur(1px)";
          // slightly offset coordinates for a beautiful chromatic fringe
          ctx.drawImage(img, -drawW / 2 - (2.5 * rippleIntensity), -drawH / 2 - 1, drawW, drawH);
          ctx.restore();
        } else {
          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        }

        ctx.restore();
        ctx.filter = "none"; // reset for physical overlays
      }

      if (isPlaying || isRecording) {
        // --- PRESET-SPECIFIC LOGIC & RENDERING ---

        // 1. Water Ripples Physics (Standard / Abyssal / Rain)
        const hasWaterRipples = preset === "standard" || preset === "rain" || preset === "abyssal";
        
        if (hasWaterRipples) {
          // Dynamic spawns
          const spawnDelay = preset === "rain" ? 450 : 2500;
          if (now - lastRippleTime > spawnDelay) {
            if (preset === "rain") {
              // Spawn multiple small splatters in rain mode
              ripples.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: 2,
                maxRadius: (Math.random() * 40 + 20) * rippleIntensity,
                alpha: Math.random() * 0.3 + 0.1,
                speed: (Math.random() * 50 + 40) * speed,
              });
            } else {
              // Concentric ripples around the hand center
              ripples.push({
                x: width * 0.45,
                y: height * 0.55,
                radius: 15,
                maxRadius: Math.min(width, height) * 0.65 * rippleIntensity,
                alpha: 0.25 * rippleIntensity,
                speed: Math.min(width, height) * 0.05 * speed,
              });
            }
            lastRippleTime = now;
          }

          // Draw and animate ripples
          for (let i = ripples.length - 1; i >= 0; i--) {
            const ripple = ripples[i];
            ripple.radius += ripple.speed * adjustedDelta;
            ripple.alpha = (preset === "rain" ? 0.35 : 0.25) * rippleIntensity * (1 - ripple.radius / ripple.maxRadius);

            if (ripple.radius >= ripple.maxRadius || ripple.alpha <= 0) {
              ripples.splice(i, 1);
              continue;
            }

            ctx.beginPath();
            ctx.ellipse(
              ripple.x,
              ripple.y,
              ripple.radius,
              ripple.radius * (preset === "rain" ? 0.8 : 0.45), // Rain has steeper splash circles, hand is flatter
              0,
              0,
              Math.PI * 2
            );
            ctx.strokeStyle = preset === "abyssal" 
              ? `rgba(100, 180, 255, ${ripple.alpha * 0.7})` 
              : `rgba(255, 255, 255, ${ripple.alpha})`;
            ctx.lineWidth = preset === "rain" ? 0.6 : 0.85;
            ctx.stroke();
          }
        }

        // 2. Mist Clouds Simulation
        if (isDarkMist) {
          for (const cloud of mistClouds) {
            const dx = cloud.targetX - cloud.x;
            const dy = cloud.targetY - cloud.y;
            const dist = Math.hypot(dx, dy);

            if (dist < 15) {
              cloud.targetX = Math.random() * width;
              cloud.targetY = Math.random() * height;
            } else {
              cloud.x += (dx / dist) * cloud.speed * adjustedDelta;
              cloud.y += (dy / dist) * cloud.speed * adjustedDelta;
            }

            const gradient = ctx.createRadialGradient(
              cloud.x, cloud.y, 0,
              cloud.x, cloud.y, cloud.radiusX
            );
            
            if (preset === "abyssal") {
              // Deep Ocean/Abyss blue fog
              gradient.addColorStop(0, "rgba(5, 12, 28, 0.45)");
              gradient.addColorStop(0.5, "rgba(2, 6, 15, 0.2)");
            } else {
              gradient.addColorStop(0, "rgba(5, 5, 5, 0.4)");
              gradient.addColorStop(0.5, "rgba(5, 5, 5, 0.2)");
            }
            gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.ellipse(cloud.x, cloud.y, cloud.radiusX, cloud.radiusY, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // 3. VHS Retro film effect glitches
        if (preset === "retro_vhs") {
          // Occasional film hairs or horizontal scanline noise jump
          if (Math.random() < 0.05) {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.lineWidth = Math.random() * 1.5;
            ctx.beginPath();
            ctx.moveTo(Math.random() * width, 0);
            ctx.lineTo(Math.random() * width + Math.random() * 30 - 15, height);
            ctx.stroke();
          }
          // Slight light flicker noise
          if (Math.random() < 0.08) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.012)";
            ctx.fillRect(0, 0, width, height);
          }
        }

        // 4. Fire/Cosmic ember warm light glow overlay
        if (preset === "fire_ember") {
          const warmGlow = ctx.createRadialGradient(
            width * 0.45, height * 0.55, 20,
            width * 0.45, height * 0.55, Math.min(width, height) * 0.5
          );
          warmGlow.addColorStop(0, "rgba(235, 95, 20, 0.09)");
          warmGlow.addColorStop(0.5, "rgba(180, 50, 10, 0.03)");
          warmGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = warmGlow;
          ctx.fillRect(0, 0, width, height);
        }

        // 5. Drawing Microparticles
        for (const p of particles) {
          p.y += p.speedY * adjustedDelta;
          p.x += p.speedX * adjustedDelta;

          // Wobble horizontal drift
          const currentWobble = Math.sin(now / 1000 * p.wobbleSpeed + p.wobbleOffset) * p.wobbleRange;
          const currentX = p.x + currentWobble;

          // Wrap around limits
          if (p.y < -15) {
            p.y = height + 15;
            p.x = Math.random() * width;
          } else if (p.y > height + 15) {
            p.y = -15;
            p.x = Math.random() * width;
          }
          if (p.x < -15) p.x = width + 15;
          else if (p.x > width + 15) p.x = -15;

          // Render depending on chosen preset
          ctx.beginPath();
          if (preset === "rain") {
            // Draw elongated rain drop streaks
            ctx.moveTo(currentX, p.y);
            ctx.lineTo(currentX + (p.speedX * 0.04), p.y + (p.speedY * 0.04));
            ctx.strokeStyle = `rgba(255, 255, 255, ${p.alpha * 0.6})`;
            ctx.lineWidth = p.size * 0.75;
            ctx.stroke();
          } else if (preset === "fire_ember") {
            // Hot orange-yellow floating ember
            ctx.arc(currentX, p.y, p.size * 1.2, 0, Math.PI * 2);
            const rVal = 230 + Math.floor(Math.random() * 25);
            const gVal = 95 + Math.floor(Math.random() * 60);
            ctx.fillStyle = `rgba(${rVal}, ${gVal}, 15, ${p.alpha * (1.1 + Math.sin(now / 180 + p.wobbleOffset) * 0.2)})`;
            ctx.fill();
            
            // Subtle aura around embers
            if (p.size > 1.0) {
              ctx.beginPath();
              ctx.arc(currentX, p.y, p.size * 3.5, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${rVal}, ${gVal}, 15, 0.06)`;
              ctx.fill();
            }
          } else if (preset === "cosmic_stellar") {
            // Twinkling stars / cross flares
            const starTwinkle = Math.sin(now / 120 + p.wobbleOffset) * 0.45 + 0.55;
            ctx.arc(currentX, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(225, 240, 255, ${p.alpha * starTwinkle * 1.5})`;
            ctx.fill();

            // Draw sparkling diffraction cross for larger stars
            if (p.size > 1.2 && starTwinkle > 0.75) {
              ctx.strokeStyle = `rgba(225, 240, 255, ${p.alpha * (starTwinkle - 0.7)})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(currentX - 5, p.y);
              ctx.lineTo(currentX + 5, p.y);
              ctx.moveTo(currentX, p.y - 5);
              ctx.lineTo(currentX, p.y + 5);
              ctx.stroke();
            }
          } else if (preset === "abyssal") {
            // Bioluminescent organic plankton (soft teal/cyan glows)
            const pulse = Math.sin(now / 200 + p.wobbleOffset) * 0.3 + 0.7;
            ctx.arc(currentX, p.y, p.size * 1.4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(110, 210, 255, ${p.alpha * pulse * 0.95})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(currentX, p.y, p.size * 4.0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(110, 210, 255, 0.04)`;
            ctx.fill();
          } else {
            // Standard / retro film dust particles (fine grayscale specs)
            ctx.arc(currentX, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = preset === "retro_vhs" 
              ? `rgba(215, 205, 195, ${p.alpha * 0.7})` 
              : `rgba(255, 255, 255, ${p.alpha})`;
            ctx.fill();
          }
        }

        // --- 6. Somatic Breathing Pulse (0.02 Hz) ---
        const breathCycle = Math.sin(now / 5000) * 0.5 + 0.5;
        const breathAlpha = breathCycle * 0.038;
        
        ctx.fillStyle = preset === "fire_ember" 
          ? `rgba(255, 120, 40, ${breathAlpha * 0.8})` 
          : preset === "abyssal"
          ? `rgba(90, 160, 255, ${breathAlpha * 0.8})`
          : `rgba(255, 255, 255, ${breathAlpha})`;
        ctx.fillRect(0, 0, width, height);
      }

      // 7. Ambient Scanlines Retro Overlay
      if (scanlines) {
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.13)";
        for (let y = 0; y < height; y += 4) {
          ctx.fillRect(0, y, width, 1.4);
        }
        ctx.restore();
      }

      // Draw elegant cinematic vignette border
      const vignette = ctx.createRadialGradient(
        width / 2, height / 2, Math.min(width, height) * 0.38,
        width / 2, height / 2, Math.max(width, height) * 0.72
      );
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.72)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [isPlaying, isRecording, preset, rippleIntensity, speed, particleSize, toneFilter, lensAberration, scanlines, imageLoaded]);

  // Record 8 seconds video function
  const handleRecordVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRecording(true);
    setRecordingTime(0);
    setTime(0);
    timeRef.current = 0;
    recordedChunksRef.current = [];

    // Capture stream at 30 FPS
    const stream = canvas.captureStream(30);

    let options = {};
    let extension = "webm";

    // Detect browser supported codecs for high quality
    if (MediaRecorder.isTypeSupported("video/mp4;codecs=h264")) {
      options = { mimeType: "video/mp4;codecs=h264", videoBitsPerSecond: 5000000 };
      extension = "mp4";
    } else if (MediaRecorder.isTypeSupported("video/mp4")) {
      options = { mimeType: "video/mp4", videoBitsPerSecond: 5000000 };
      extension = "mp4";
    } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
      options = { mimeType: "video/webm;codecs=vp9", videoBitsPerSecond: 5000000 };
    } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
      options = { mimeType: "video/webm;codecs=vp8", videoBitsPerSecond: 5000000 };
    } else {
      options = { mimeType: "video/webm" };
    }

    try {
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: recorder.mimeType || "video/mp4"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `veo_simulado_${preset}_${Date.now()}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsRecording(false);
      };

      recorder.start();
    } catch (err) {
      console.error("Falha ao iniciar gravador de mídia:", err);
      setIsRecording(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full bg-[#050505] overflow-hidden flex items-center justify-center select-none"
    >
      {/* Interactive Physical Canvas (Handles Image + Particles + Ripples + Vignette) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10"
      />

      {/* Loader placeholder when image isn't loaded yet */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-neutral-500 z-30">
          <Loader2 className="w-8 h-8 animate-spin text-white mb-2" />
          <span className="text-[10px] tracking-widest uppercase font-mono">Preparando Canvas...</span>
        </div>
      )}

      {/* Recording overlay HUD */}
      {isRecording && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center text-center z-40 transition-all">
          <div className="space-y-4 max-w-sm px-6">
            <div className="relative flex items-center justify-center mx-auto w-12 h-12">
              <span className="absolute animate-ping inline-flex h-8 w-8 rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-white font-bold">GRAVANDO VÍDEO ({preset.toUpperCase()})</h4>
              <p className="text-xs text-neutral-400 font-serif mt-1 leading-relaxed">
                Renderizando e capturando as ondulações físicas e partículas a 30 FPS diretamente no formato de vídeo.
              </p>
            </div>
            {/* Minimal Progress Bar */}
            <div className="w-full bg-white/10 h-[2px]">
              <div 
                className="bg-red-500 h-full transition-all duration-[33ms]" 
                style={{ width: `${(recordingTime / 8.0) * 100}%` }}
              />
            </div>
            <span className="text-[10px] tracking-widest font-mono text-neutral-500 block">
              {recordingTime.toFixed(1)}s / 8.0s ({Math.round((recordingTime / 8.0) * 100)}%)
            </span>
          </div>
        </div>
      )}

      {/* Floating HUD overlay on hovering simulated video */}
      <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/95 backdrop-blur border border-white/10 p-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setTime(0)}
            className="p-1.5 hover:bg-white/10 text-white transition-colors"
            title="Reiniciar"
          >
            <Play className="w-4 h-4" />
          </button>
          <span className="text-[10px] tracking-widest uppercase font-sans text-neutral-400">
            {time.toFixed(1)}s / 8.0s • Efeito: <span className="text-white font-bold">{preset.replace("_", " ").toUpperCase()}</span>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRecordVideo}
            disabled={isRecording}
            className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-sans px-4 py-2 border border-red-500/40 text-white bg-black hover:bg-red-600 hover:border-red-600 transition-all font-bold"
          >
            <Download className="w-3.5 h-3.5" /> Baixar Vídeo MP4 / WebM
          </button>
        </div>
      </div>
    </div>
  );
}
