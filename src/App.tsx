import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Download,
  Sparkles,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Image as ImageIcon,
  Video,
  Sliders,
  Film,
  ArrowRight,
  Eye,
  Contrast,
  SlidersHorizontal,
  Compass,
  FileVideo,
  HelpCircle,
  ChevronRight,
  Maximize2
} from "lucide-react";
import { SimulatedAnimation } from "./components/SimulatedAnimation";

// Predefined Gorgeous Black & White Water Ripples Hand (high-contrast monochrome SVG as data URL to prevent external dependency failures)
const DEFAULT_MONOCHROME_HAND = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" style="background:radial-gradient(circle at 45% 55%, %231a1a1a 0%, %23000000 100%);">
  <!-- Water Waves / Ondulações -->
  <circle cx="580" cy="360" r="40" fill="none" stroke="%23ffffff" stroke-width="0.5" stroke-opacity="0.2" />
  <circle cx="580" cy="360" r="80" fill="none" stroke="%23ffffff" stroke-width="0.75" stroke-opacity="0.3" />
  <circle cx="580" cy="360" r="140" fill="none" stroke="%23ffffff" stroke-width="1" stroke-opacity="0.25" />
  <circle cx="580" cy="360" r="220" fill="none" stroke="%23ffffff" stroke-width="0.5" stroke-opacity="0.15" />
  <circle cx="580" cy="360" r="320" fill="none" stroke="%23ffffff" stroke-width="0.25" stroke-opacity="0.1" />
  <circle cx="580" cy="360" r="440" fill="none" stroke="%23ffffff" stroke-width="0.2" stroke-opacity="0.05" />

  <!-- Mystical Nebulous Fog / Névoa Sombria -->
  <radialGradient id="fog" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="%23000000" stop-opacity="0.8" />
    <stop offset="50%" stop-color="%23121212" stop-opacity="0.4" />
    <stop offset="100%" stop-color="%23000000" stop-opacity="1" />
  </radialGradient>
  <rect width="1280" height="720" fill="url(%23fog)" opacity="0.4" />

  <!-- Ambient Light Sparks / Partículas de Luz -->
  <circle cx="340" cy="210" r="1.5" fill="%23ffffff" opacity="0.6" />
  <circle cx="480" cy="150" r="1" fill="%23ffffff" opacity="0.4" />
  <circle cx="890" cy="280" r="2" fill="%23ffffff" opacity="0.7" />
  <circle cx="650" cy="480" r="1" fill="%23ffffff" opacity="0.5" />
  <circle cx="210" cy="530" r="1.5" fill="%23ffffff" opacity="0.3" />
  <circle cx="720" cy="180" r="1" fill="%23ffffff" opacity="0.4" />
  
  <!-- Hand silhouette with high-contrast edge glowing/shimmering -->
  <path d="M 520 420 
           C 510 390, 520 370, 530 365 
           C 540 360, 550 375, 555 390 
           C 560 370, 570 350, 580 345 
           C 590 340, 595 360, 595 380 
           C 600 355, 615 340, 625 342 
           C 635 344, 630 370, 628 390 
           C 635 375, 645 365, 652 370 
           C 658 375, 652 395, 642 410
           C 620 440, 590 460, 550 460
           C 520 460, 510 440, 520 420 Z" 
        fill="%23080808" 
        stroke="%239c9c9c" 
        stroke-width="1.5" 
        stroke-linejoin="round"
        filter="drop-shadow(0px 0px 4px rgba(255,255,255,0.4))" />

  <!-- Splash ripples close to fingers -->
  <path d="M 540 395 Q 545 390 550 395" fill="none" stroke="%23ffffff" stroke-width="0.75" stroke-opacity="0.6" />
  <path d="M 570 380 Q 580 375 590 380" fill="none" stroke="%23ffffff" stroke-width="1" stroke-opacity="0.7" />
  <path d="M 610 385 Q 618 382 625 388" fill="none" stroke="%23ffffff" stroke-width="0.75" stroke-opacity="0.5" />

  <!-- Subtle text overlays to match high-end cinematic vibe -->
  <text x="640" y="680" font-family="monospace" font-size="12" fill="%23555555" text-anchor="middle" letter-spacing="4">COMPOSTO ORIGINAL DE ALTO CONTRASTE • 8s LOOP</text>
</svg>`;

// Predefined cinematic prompt presets
const PRESETS = [
  {
    id: "user-request",
    title: "Sopro de Vida Sutil (Português)",
    description: "Leve oscilação da água com ondulações, partículas sutis, névoa escura e zoom de 2%.",
    prompt: "Transforme esta imagem em um vídeo cinematográfico hiper-realista de 8 segundos. Preserve 100% da composição original, sem alterar o rosto, a mão ou a atmosfera. Adicione apenas movimentos extremamente sutis: uma respiração quase imperceptível, leve oscilação da água ao redor da mão criando pequenas ondulações, partículas e bolhas minúsculas flutuando lentamente, uma névoa escura se movendo suavemente e um efeito discreto de câmera com zoom in de apenas 2% durante toda a cena. Iluminação estável, contraste alto, tons preto e branco, clima sombrio e misterioso. Sem movimentos bruscos, sem piscar, sem distorções, sem deformar dedos, rosto ou olhos. O resultado deve parecer uma fotografia viva, elegante e hipnotizante.",
    mood: "Monochrome, Somber, Ethereal, Hypnotic"
  },
  {
    id: "dark-mystic",
    title: "Sombra Abissal & Ondulações",
    description: "Intensificação de contraste com névoa mais espessa e ondulações de água concêntricas.",
    prompt: "Deep abyssal aesthetic, high contrast black and white cinematic video. Hypnotic concentric water ripples expanding slowly around the hand, dark moving fog rolling over the surface, micro dust particles shining under a steady spotlight, minimal 2% scale animation over 8 seconds. Ultra-realistic, high-fidelity.",
    mood: "Abyssal, Noir, High-contrast"
  },
  {
    id: "cinematic-particles",
    title: "Flutuação de Micropartículas",
    description: "Foco no feixe de luz destacando poeira cósmica flutuando na água.",
    prompt: "Aesthetic black and white footage. Tiny luminous floating dust particles and microscopic bubbles rising slowly through dark liquid. Stable studio illumination, high contrast, perfect anatomy of hand, delicate ambient mist, subtle cinematic panning.",
    mood: "Mysterious, High-contrast, Particulate"
  }
];

interface HistoryItem {
  id: string;
  operationName: string;
  prompt: string;
  aspectRatio: string;
  resolution: string;
  image: string;
  timestamp: string;
}

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string>(DEFAULT_MONOCHROME_HAND);
  const [prompt, setPrompt] = useState<string>(PRESETS[0].prompt);
  const [aspectRatio, setAspectRatio] = useState<string>("16:9");
  const [resolution, setResolution] = useState<string>("1080p");
  const [modelName, setModelName] = useState<string>("veo-3.1-fast-generate-preview");
  
  // Generation States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [operationName, setOperationName] = useState<string>("");
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [generationError, setGenerationError] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const [simulatedTime, setSimulatedTime] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Simulation customization states
  const [simPreset, setSimPreset] = useState<string>("standard");
  const [simRippleIntensity, setSimRippleIntensity] = useState<number>(1.0);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [simParticleSize, setSimParticleSize] = useState<number>(1.0);
  const [simToneFilter, setSimToneFilter] = useState<string>("monochrome");
  const [simLensAberration, setSimLensAberration] = useState<boolean>(true);
  const [simScanlines, setSimScanlines] = useState<boolean>(false);
  
  // UI states
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("editor"); // editor | history | guide
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Status check timer
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Read history from localStorage on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cinematic_animator_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }, []);

  // Save history helper
  const saveToHistory = (item: HistoryItem) => {
    const updated = [item, ...history].slice(0, 10);
    setHistory(updated);
    try {
      localStorage.setItem("cinematic_animator_history", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  };

  // Re-run status check on operationName change
  const startPollingStatus = (opName: string) => {
    if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    
    setGenerationProgress(5);
    setCurrentStep("Registrando requisição nos servidores Veo...");
    
    let counter = 0;
    const progressSteps = [
      { prg: 10, step: "Analisando composição e contraste da imagem de entrada..." },
      { prg: 20, step: "Preservando fidelidade da mão e textura..." },
      { prg: 35, step: "Calculando trajetórias de partículas e simulação física de água..." },
      { prg: 50, step: "Modelando movimento sutil de névoa escura nas bordas..." },
      { prg: 65, step: "Injetando efeito suave de câmera com zoom de 2%..." },
      { prg: 80, step: "Renderizando quadros intermediários em alta fidelidade..." },
      { prg: 90, step: "Compilando arquivo de vídeo cinemático MP4 final..." },
      { prg: 95, step: "Ajustando canal de streaming de download..." }
    ];

    pollingTimerRef.current = setInterval(async () => {
      counter++;
      
      // Advance step text and mock progress bar gently to feel responsive
      const currentMilestone = progressSteps.find(s => s.prg > generationProgress);
      if (currentMilestone) {
        setGenerationProgress(prev => Math.min(prev + 1, currentMilestone.prg));
        setCurrentStep(currentMilestone.step);
      } else {
        setGenerationProgress(prev => Math.min(prev + 0.5, 98));
      }

      try {
        const res = await fetch("/api/video-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationName: opName }),
        });

        if (!res.ok) throw new Error("Erro de comunicação com o servidor de status.");
        
        const data = await res.json();
        
        if (data.error) {
          clearInterval(pollingTimerRef.current!);
          setIsGenerating(false);
          setGenerationError(`Veo Error: ${data.error.message || JSON.stringify(data.error)}`);
          return;
        }

        if (data.done) {
          clearInterval(pollingTimerRef.current!);
          setGenerationProgress(100);
          setCurrentStep("Pronto! Transmitindo vídeo final...");
          
          // Construct download proxy URL
          const downloadUrl = `/api/video-download?operationName=${encodeURIComponent(opName)}`;
          setVideoUrl(downloadUrl);
          setIsGenerating(false);
          setVideoPlaying(true);

          // Add to History
          saveToHistory({
            id: Date.now().toString(),
            operationName: opName,
            prompt,
            aspectRatio,
            resolution,
            image: selectedImage,
            timestamp: new Date().toLocaleTimeString()
          });
        }
      } catch (err: any) {
        console.error("Polling error:", err);
        // Don't stop on single transient fetch failure, keep trying up to a limit
        if (counter > 120) { // ~6 minutes maximum
          clearInterval(pollingTimerRef.current!);
          setIsGenerating(false);
          setGenerationError("A geração do vídeo excedeu o tempo limite. Tente novamente.");
        }
      }
    }, 3000); // Poll every 3 seconds
  };

  useEffect(() => {
    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, []);

  const handleStartSimulation = () => {
    setGenerationError("");
    setIsGenerating(true);
    setVideoUrl("");
    setIsSimulated(false);
    setGenerationProgress(5);
    setCurrentStep("Iniciando Renderizador Simulado...");

    const progressSteps = [
      { prg: 20, step: "Analisando composição e contraste da imagem base..." },
      { prg: 45, step: "Preservando fidelidade e texturas originais..." },
      { prg: 70, step: "Ativando acelerador de partículas e loops de ondulações..." },
      { prg: 90, step: "Compilando simulação cinematográfica de 8 segundos..." },
      { prg: 100, step: "Renderização Simulada Concluída!" }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < progressSteps.length) {
        const milestone = progressSteps[stepIndex];
        setGenerationProgress(milestone.prg);
        setCurrentStep(milestone.step);
        stepIndex++;
      } else {
        clearInterval(interval);
        setIsGenerating(false);
        setIsSimulated(true);
        setVideoPlaying(true);
        
        saveToHistory({
          id: `sim_${Date.now()}`,
          operationName: "SIMULADO",
          prompt,
          aspectRatio,
          resolution,
          image: selectedImage,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }, 1000);
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      setGenerationError("Por favor, envie uma foto primeiro.");
      return;
    }

    setIsGenerating(true);
    setGenerationError("");
    setVideoUrl("");
    setIsSimulated(false);
    setGenerationProgress(2);
    setCurrentStep("Inicializando motor de inteligência artificial...");

    try {
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: selectedImage,
          prompt,
          aspectRatio,
          resolution,
          model: modelName
        }),
      });

      let data: any = null;
      let errorMsg = "Ocorreu um erro no servidor backend.";
      try {
        const text = await res.text();
        data = JSON.parse(text);
        if (data && data.error) {
          errorMsg = data.error;
        }
      } catch (e) {
        // Response was not JSON
      }

      if (!res.ok) {
        const lowerMsg = errorMsg.toLowerCase();
        if (
          res.status === 429 ||
          lowerMsg.includes("resource_exhausted") ||
          lowerMsg.includes("quota") ||
          lowerMsg.includes("limit") ||
          lowerMsg.includes("exceeded") ||
          lowerMsg.includes("429")
        ) {
          const quotaErr = new Error(errorMsg);
          (quotaErr as any).isQuota = true;
          throw quotaErr;
        }
        throw new Error(errorMsg);
      }

      if (!data || !data.operationName) {
        throw new Error("Nenhum nome de operação foi retornado pelo backend.");
      }

      setOperationName(data.operationName);
      startPollingStatus(data.operationName);
    } catch (err: any) {
      console.error("Generation launch error:", err);
      setIsGenerating(false);
      if (err.isQuota) {
        setGenerationError("COTA_EXCEDIDA_VEO");
      } else {
        setGenerationError(err.message || "Erro de conexão ao iniciar renderização.");
      }
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setGenerationError("Por favor, selecione apenas arquivos de imagem.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedImage(event.target.result as string);
        setGenerationError("");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleApplyPreset = (presetPrompt: string) => {
    setPrompt(presetPrompt);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause();
        setVideoPlaying(false);
      } else {
        videoRef.current.play().catch(e => console.log("Play interrupted", e));
        setVideoPlaying(true);
      }
    }
  };

  return (
    <div id="cinematic-app-root" className="min-h-screen bg-[#050505] text-[#d4d4d4] flex flex-col font-serif selection:bg-white selection:text-black antialiased">
      {/* Header */}
      <header id="header-bar" className="flex justify-between items-center px-6 md:px-12 py-6 border-b border-white/10 bg-[#050505]">
        <div className="flex items-center space-x-4">
          <span className="text-[10px] tracking-[0.4em] uppercase font-sans font-light opacity-50 hidden sm:inline">Studio Edition</span>
          <h1 className="text-xl md:text-2xl tracking-[0.15em] uppercase font-normal text-white flex items-center gap-2">
            Cinéma Vif <span className="text-[9px] tracking-widest font-sans px-1.5 py-0.5 rounded bg-white/10 text-white/70 border border-white/20">VEO 3.1</span>
          </h1>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-6 md:space-x-8 text-[10px] tracking-[0.3em] uppercase font-sans">
          <button
            id="nav-editor"
            onClick={() => setActiveTab("editor")}
            className={`transition-colors py-1 ${
              activeTab === "editor"
                ? "text-white border-b border-white/40 font-medium"
                : "text-neutral-500 hover:text-neutral-200"
            }`}
          >
            Processar
          </button>
          <button
            id="nav-history"
            onClick={() => setActiveTab("history")}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === "history"
                ? "text-white border-b border-white/40 font-medium"
                : "text-neutral-500 hover:text-neutral-200"
            }`}
          >
            Fila {history.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
          </button>
          <button
            id="nav-guide"
            onClick={() => setActiveTab("guide")}
            className={`transition-colors py-1 ${
              activeTab === "guide"
                ? "text-white border-b border-white/40 font-medium"
                : "text-neutral-500 hover:text-neutral-200"
            }`}
          >
            Galeria
          </button>
        </nav>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
        {activeTab === "editor" && (
          <>
            {/* Left Hand: Workspace & Visualizer */}
            <div id="visualizer-panel" className="lg:col-span-7 flex flex-col space-y-6">
              
              {/* Cinematic Preview Stage */}
              <div className="relative aspect-video overflow-hidden bg-black border border-white/10 shadow-2xl flex flex-col justify-between group">
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60 pointer-events-none z-10" />

                {/* Video generated or Generating status */}
                {videoUrl ? (
                  <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
                    <video
                      ref={videoRef}
                      id="cinematic-video-player"
                      src={videoUrl}
                      className="w-full h-full object-contain"
                      loop
                      autoPlay
                      playsInline
                      onPlay={() => setVideoPlaying(true)}
                      onPause={() => setVideoPlaying(false)}
                    />
                    
                    {/* Floating HUD overlay on hovering video */}
                    <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/95 backdrop-blur border border-white/10 p-3">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={toggleVideoPlayback}
                          className="p-1.5 hover:bg-white/10 text-white transition-colors"
                        >
                          {videoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <span className="text-[10px] tracking-widest uppercase font-sans text-neutral-400">8.0s • {resolution} ({aspectRatio})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={videoUrl}
                          download="cinematic_animation.mp4"
                          className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-sans px-4 py-2 border border-white text-white bg-black hover:bg-white hover:text-black transition-all"
                        >
                          <Download className="w-3.5 h-3.5" /> Baixar
                        </a>
                      </div>
                    </div>
                  </div>
                ) : isSimulated ? (
                  <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
                    <SimulatedAnimation
                      image={selectedImage}
                      isPlaying={videoPlaying}
                      prompt={prompt}
                      onTimeUpdate={(currentTime) => setSimulatedTime(currentTime)}
                      preset={simPreset}
                      rippleIntensity={simRippleIntensity}
                      speed={simSpeed}
                      particleSize={simParticleSize}
                      toneFilter={simToneFilter}
                      lensAberration={simLensAberration}
                      scanlines={simScanlines}
                    />
                  </div>
                ) : isGenerating ? (
                  /* Elegant Cinematic Loading Canvas */
                  <div className="absolute inset-0 bg-[#050505] flex flex-col items-center justify-center p-6 text-center z-20">
                    <div className="relative mb-6">
                      <div className="w-12 h-12 rounded-full border-t border-white border-r border-b-0 border-l-0 animate-spin flex items-center justify-center" />
                      <Sparkles className="w-4 h-4 text-white absolute inset-0 m-auto animate-pulse" />
                    </div>
                    
                    <h3 className="text-xs tracking-[0.3em] uppercase text-white font-sans">COMPOSING CINEMATIC MOTION</h3>
                    <p className="text-[10px] tracking-wider text-neutral-400 mt-2 font-sans h-8">
                      {currentStep}
                    </p>

                    {/* Progress slider bar */}
                    <div className="w-full max-w-sm bg-white/5 border border-white/10 h-1 mt-6 relative">
                      <div
                        className="bg-white h-full transition-all duration-500 shadow-[0_0_8px_#ffffff]"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                    <span className="text-[9px] tracking-widest uppercase text-neutral-500 mt-3 font-sans">{Math.round(generationProgress)}% COMPLETE</span>

                    {/* Reassuring monograph style text */}
                    <div className="mt-8 border-t border-white/5 pt-4 w-full max-w-xs">
                      <p className="text-[10px] tracking-wide leading-relaxed text-neutral-500 font-sans italic">
                        &ldquo;The ripple of a still moment. Veo 3.1 creates high-fidelity photography in active motion.&rdquo;
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Original static image canvas */
                  <div className="absolute inset-0 w-full h-full bg-[#050505] flex items-center justify-center">
                    {selectedImage ? (
                      <img
                        id="original-image-preview"
                        src={selectedImage}
                        alt="Preview original"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="text-neutral-600 flex flex-col items-center">
                        <ImageIcon className="w-10 h-10 mb-2 stroke-1" />
                        <span className="text-[10px] tracking-widest uppercase font-sans">Vazio</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Source Flag */}
                <div className="absolute top-6 left-6 z-20 flex items-center space-x-3">
                  <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md text-[9px] uppercase tracking-[0.2em] border border-white/20 text-white font-sans">
                    {videoUrl ? "ACTIVE ANIMATION" : "SOURCE FRAME"}
                  </span>
                  {selectedImage === DEFAULT_MONOCHROME_HAND && !videoUrl && !isSimulated && (
                    <span className="px-2.5 py-1 bg-white text-black text-[9px] uppercase tracking-[0.2em] font-sans flex items-center gap-1.5">
                      <Compass className="w-3 h-3" /> MONOCHROME REFERENCE
                    </span>
                  )}
                </div>

                {/* Split comparison toggle */}
                {(videoUrl || isSimulated) && (
                  <button
                    onClick={() => {
                      if (confirm("Quer voltar para a imagem estática de entrada para comparar?")) {
                        setVideoUrl("");
                        setIsSimulated(false);
                      }
                    }}
                    className="absolute top-6 right-6 z-20 px-2.5 py-1 bg-black/80 hover:bg-white hover:text-black border border-white/20 text-white text-[9px] uppercase tracking-[0.2em] transition-all font-sans flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" /> COMPARE FRAME
                  </button>
                )}
              </div>

              {/* Action Bar / Dual controls under stage */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-black border border-white/10 p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 border border-white/10 text-neutral-400">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[10px] tracking-widest uppercase font-sans text-neutral-200">FRAME WORKSPACE</h4>
                      <p className="text-[11px] text-neutral-500 font-sans">Modificar imagem base</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedImage !== DEFAULT_MONOCHROME_HAND && (
                      <button
                        onClick={() => {
                          setSelectedImage(DEFAULT_MONOCHROME_HAND);
                          setIsSimulated(false);
                          setVideoUrl("");
                        }}
                        className="text-[9px] tracking-widest uppercase font-sans border border-white/20 hover:border-white text-neutral-400 px-2.5 py-1.5 bg-black"
                      >
                        RESTAURAR
                      </button>
                    )}
                    <button
                      onClick={triggerFileUpload}
                      className="text-[9px] tracking-widest uppercase font-sans px-3 py-1.5 bg-white text-black font-bold hover:bg-neutral-200 transition-all flex items-center gap-1"
                    >
                      <UploadCloud className="w-3.5 h-3.5" /> ENVIAR ARQUIVO
                    </button>
                  </div>
                </div>

                {(videoUrl || isSimulated) && (
                  <button
                    onClick={() => {
                      setVideoUrl("");
                      setIsSimulated(false);
                      setVideoPlaying(false);
                    }}
                    className="px-5 py-4 border border-white/20 hover:border-white text-[9px] tracking-widest uppercase font-sans text-neutral-300 bg-black transition-all flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" /> NOVA ANIMAÇÃO
                  </button>
                )}
              </div>

              {/* Dropzone Container (when active) or Helper tip */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border border-dashed p-8 text-center transition-all flex flex-col items-center justify-center ${
                  dragActive
                    ? "border-white bg-white/5 text-white"
                    : "border-white/10 bg-black/20 text-neutral-500 hover:border-white/30"
                }`}
                onClick={triggerFileUpload}
                style={{ cursor: "pointer" }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <UploadCloud className="w-6 h-6 mb-3 text-neutral-500" />
                <p className="text-[10px] tracking-widest uppercase font-sans text-neutral-400">ARRASTE E SOLTE SUA IMAGEM DE ALTA RESOLUÇÃO</p>
                <p className="text-[10px] text-neutral-600 mt-1 font-sans">PNG, JPEG, WEBP até 10MB</p>
              </div>

              {/* Presets / Showcase Selection */}
              <div className="bg-black border border-white/10 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[10px] font-sans tracking-[0.25em] text-neutral-400 uppercase flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-neutral-500" /> PRESETS CINEMÁTICOS DE MOVIMENTO
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {PRESETS.map((preset) => {
                    const isSelected = prompt === preset.prompt;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleApplyPreset(preset.prompt)}
                        className={`text-left p-4 border transition-all flex flex-col justify-between ${
                          isSelected
                            ? "bg-white text-black border-white"
                            : "bg-[#0a0a0a] hover:bg-white/5 border-white/10 text-neutral-400"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <h5 className={`text-[10px] tracking-widest uppercase font-sans font-semibold ${isSelected ? "text-black" : "text-white"}`}>{preset.title}</h5>
                            {isSelected && <CheckCircle className="w-3 h-3 text-black" />}
                          </div>
                          <p className={`text-[11px] mt-2 leading-relaxed line-clamp-3 font-serif ${isSelected ? "text-black/80" : "text-neutral-500"}`}>
                            {preset.description}
                          </p>
                        </div>
                        <div className={`mt-3 pt-2 border-t flex items-center justify-between ${isSelected ? "border-black/10" : "border-white/5"}`}>
                          <span className={`text-[8px] font-sans tracking-widest uppercase ${isSelected ? "text-black/60" : "text-neutral-500"}`}>{preset.mood}</span>
                          <span className="text-[8px] font-sans tracking-widest uppercase font-bold">
                            APLICAR
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Hand: Settings & Parameters Controller */}
            <div id="settings-panel" className="lg:col-span-5 bg-black border border-white/10 p-6 flex flex-col space-y-8 shadow-2xl">
              <div>
                <h3 className="text-[10px] tracking-[0.3em] uppercase opacity-40 mb-2 font-sans">Motion Dynamics</h3>
                <p className="text-[11px] text-neutral-400">Parâmetros e instruções de simulação física</p>
              </div>

              {/* Somatic Motion details simulating the Design Theme */}
              <div className="space-y-4 border-b border-white/10 pb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] tracking-widest uppercase font-sans">
                    <span>Somatic Breathing</span>
                    <span className="text-white">0.02 Hz</span>
                  </div>
                  <div className="h-[1px] bg-white/10 w-full relative">
                    <div className="absolute h-[3px] w-4 bg-white -top-[1px] left-[15%]"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] tracking-widest uppercase font-sans">
                    <span>Fluid Oscillation</span>
                    <span className="text-white">Subtle</span>
                  </div>
                  <div className="h-[1px] bg-white/10 w-full relative">
                    <div className="absolute h-[3px] w-4 bg-white -top-[1px] left-[40%]"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] tracking-widest uppercase font-sans">
                    <span>Suspended Particles</span>
                    <span className="text-white">Micro</span>
                  </div>
                  <div className="h-[1px] bg-white/10 w-full relative">
                    <div className="absolute h-[3px] w-4 bg-white -top-[1px] left-[25%]"></div>
                  </div>
                </div>
              </div>

              {/* Prompt Textarea */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] tracking-widest uppercase font-sans">
                  <span className="opacity-70">Diretrizes Artísticas</span>
                  <span className="opacity-40">Preserve 100%</span>
                </div>
                <textarea
                  id="prompt-input"
                  rows={5}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Instruções para o renderizador..."
                  className="w-full bg-[#0d0d0d] border border-white/10 rounded-none p-3 text-xs text-neutral-200 placeholder:text-neutral-700 focus:outline-none focus:border-white/40 transition-colors resize-none leading-relaxed font-sans"
                />
              </div>

              {/* Configuration Grid */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Model selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] tracking-widest uppercase opacity-60 block font-sans">Modelo</label>
                  <select
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-white/10 rounded-none p-2 text-xs text-white focus:outline-none focus:border-white/40 font-sans"
                  >
                    <option value="veo-3.1-fast-generate-preview">veo-3.1-fast</option>
                    <option value="veo-3.1-lite-generate-preview">veo-3.1-lite</option>
                  </select>
                </div>

                {/* Aspect ratio */}
                <div className="space-y-1.5">
                  <label className="text-[10px] tracking-widest uppercase opacity-60 block font-sans">Aspect Ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-white/10 rounded-none p-2 text-xs text-white focus:outline-none focus:border-white/40 font-sans"
                  >
                    <option value="16:9">16:9 Cinema</option>
                    <option value="9:16">9:16 Vertical</option>
                  </select>
                </div>

              </div>

              {/* CONFIGURAÇÃO DA SIMULAÇÃO EM TEMPO REAL */}
              <div className={`p-4 border ${isSimulated ? "border-white/30 bg-white/5" : "border-white/10 bg-black/40"} space-y-4 transition-all duration-300`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-3.5 h-3.5 text-white" />
                    <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-white">Controles do Simulador</span>
                  </div>
                  {isSimulated ? (
                    <span className="text-[8px] bg-white text-black font-bold px-1.5 py-0.5 uppercase tracking-wider animate-pulse">Ativo Live</span>
                  ) : (
                    <span className="text-[8px] border border-white/20 text-neutral-400 px-1.5 py-0.5 uppercase tracking-wider">Preview</span>
                  )}
                </div>

                <div className="space-y-3 pt-2 border-t border-white/10">
                  {/* Select Preset */}
                  <div className="space-y-1">
                    <label className="text-[9px] tracking-widest uppercase opacity-60 block font-sans">Efeito Físico Base</label>
                    <select
                      value={simPreset}
                      onChange={(e) => {
                        setSimPreset(e.target.value);
                        // Also auto-activate simulation to give instant visual feedback!
                        if (!isSimulated) {
                          setIsSimulated(true);
                          setVideoPlaying(true);
                        }
                      }}
                      className="w-full bg-[#0d0d0d] border border-white/10 rounded-none p-2 text-xs text-white focus:outline-none focus:border-white/40 font-sans"
                    >
                      <option value="standard">Sopro de Vida Sutil (Padrão)</option>
                      <option value="rain">Tempestade Cinematográfica (Chuva)</option>
                      <option value="cosmic_stellar">Poeira Cósmica Twinkle (Stellar)</option>
                      <option value="abyssal">Abismo Oceânico Escuro (Abyssal)</option>
                      <option value="retro_vhs">Fita Retro 8mm/VHS (Vintage)</option>
                      <option value="fire_ember">Brasas Flutuantes & Fogo (Ember)</option>
                    </select>
                  </div>

                  {/* Select Filter */}
                  <div className="space-y-1">
                    <label className="text-[9px] tracking-widest uppercase opacity-60 block font-sans">Gradação de Cor (LUT)</label>
                    <select
                      value={simToneFilter}
                      onChange={(e) => {
                        setSimToneFilter(e.target.value);
                        if (!isSimulated) {
                          setIsSimulated(true);
                          setVideoPlaying(true);
                        }
                      }}
                      className="w-full bg-[#0d0d0d] border border-white/10 rounded-none p-2 text-xs text-white focus:outline-none focus:border-white/40 font-sans"
                    >
                      <option value="monochrome">Preto e Branco Noir (Standard)</option>
                      <option value="warm_amber">Sépia Ouro (Warm Amber)</option>
                      <option value="deep_blue">Azul Glacial (Deep Blue)</option>
                      <option value="sepia">Papel Envelhecido (Sepia Vintage)</option>
                      <option value="acid_green">Verde Cibernético (Acid Green)</option>
                    </select>
                  </div>

                  {/* Sliders Grid */}
                  <div className="space-y-2.5 pt-1">
                    {/* Ripple Intensity Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] tracking-widest uppercase font-sans opacity-70">
                        <span>Intensidade de Ondulações</span>
                        <span className="text-white font-mono">{simRippleIntensity.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="3.0"
                        step="0.1"
                        value={simRippleIntensity}
                        onChange={(e) => {
                          setSimRippleIntensity(parseFloat(e.target.value));
                          if (!isSimulated) {
                            setIsSimulated(true);
                            setVideoPlaying(true);
                          }
                        }}
                        className="w-full h-1 bg-[#0d0d0d] rounded-none appearance-none cursor-pointer accent-white border border-white/10"
                      />
                    </div>

                    {/* Particle Size Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] tracking-widest uppercase font-sans opacity-70">
                        <span>Densidade de Partículas</span>
                        <span className="text-white font-mono">{simParticleSize.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="3.0"
                        step="0.1"
                        value={simParticleSize}
                        onChange={(e) => {
                          setSimParticleSize(parseFloat(e.target.value));
                          if (!isSimulated) {
                            setIsSimulated(true);
                            setVideoPlaying(true);
                          }
                        }}
                        className="w-full h-1 bg-[#0d0d0d] rounded-none appearance-none cursor-pointer accent-white border border-white/10"
                      />
                    </div>

                    {/* Speed Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] tracking-widest uppercase font-sans opacity-70">
                        <span>Velocidade da Dinâmica</span>
                        <span className="text-white font-mono">{simSpeed.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="3.0"
                        step="0.1"
                        value={simSpeed}
                        onChange={(e) => {
                          setSimSpeed(parseFloat(e.target.value));
                          if (!isSimulated) {
                            setIsSimulated(true);
                            setVideoPlaying(true);
                          }
                        }}
                        className="w-full h-1 bg-[#0d0d0d] rounded-none appearance-none cursor-pointer accent-white border border-white/10"
                      />
                    </div>
                  </div>

                  {/* Toggles Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-1.5 border-t border-white/5">
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={simLensAberration}
                        onChange={(e) => {
                          setSimLensAberration(e.target.checked);
                          if (!isSimulated) {
                            setIsSimulated(true);
                            setVideoPlaying(true);
                          }
                        }}
                        className="w-3 h-3 accent-white bg-[#0d0d0d] border border-white/20 rounded-none"
                      />
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 group-hover:text-white transition-colors">Aberração</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={simScanlines}
                        onChange={(e) => {
                          setSimScanlines(e.target.checked);
                          if (!isSimulated) {
                            setIsSimulated(true);
                            setVideoPlaying(true);
                          }
                        }}
                        className="w-3 h-3 accent-white bg-[#0d0d0d] border border-white/20 rounded-none"
                      />
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 group-hover:text-white transition-colors">Scanlines (CRT)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Quick Atmospheric Filters style */}
              <div className="space-y-3">
                <span className="text-[10px] tracking-widest uppercase opacity-40 font-sans block">Atmosphere Presets</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPrompt("High contrast black and white cinematic photography viva. Subtle dark mist floating gently around the hand, microscopic water ripples, ultra realistic hand detail. 2% camera zoom.")}
                    className="border border-white/20 px-3 py-2 text-[9px] uppercase tracking-widest bg-white/5 hover:bg-white/10 transition-all font-sans text-left"
                  >
                    Dark Mist
                  </button>
                  <button
                    onClick={() => setPrompt(PRESETS[0].prompt)}
                    className="border border-white/60 px-3 py-2 text-[9px] uppercase tracking-widest bg-white text-black font-bold font-sans text-left"
                  >
                    High Contrast
                  </button>
                </div>
              </div>

              {/* Status Alert panel */}
              <div className="p-4 border border-white/10 bg-white/5 backdrop-blur-sm space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-white/70 font-sans">Lens Zoom: 2% In-Motion</span>
                </div>
              </div>

              {/* Error Alert panel */}
              {generationError === "COTA_EXCEDIDA_VEO" ? (
                <div className="border border-white/20 bg-white/5 p-4 text-xs font-sans space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase tracking-widest text-[9px] text-white">Cota Veo Excedida (429)</span>
                      <p className="mt-1 text-neutral-400 leading-relaxed text-[11px]">
                        A cota diária de processamento da API Veo 3.1 foi atingida ou requer faturamento nas configurações do AI Studio.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-[10px] text-neutral-400 mb-2 font-serif italic">
                      Deseja ativar o renderizador simulado em tempo real? Ele recria os mesmos parâmetros (zoom cinemático de 2%, ondulações físicas e micropartículas) diretamente no navegador de forma instantânea.
                    </p>
                    <button
                      onClick={handleStartSimulation}
                      className="w-full py-2 bg-white text-black hover:bg-neutral-200 font-bold uppercase tracking-widest text-[9px] transition-all"
                    >
                      ATIVAR SIMULADOR CINEMÁTICO
                    </button>
                  </div>
                </div>
              ) : generationError && (
                <div className="border border-red-500/30 bg-red-950/20 p-3 text-xs text-red-200 font-sans flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold uppercase tracking-wider text-[9px]">Erro</span>
                    <p className="mt-0.5 text-neutral-400">{generationError}</p>
                  </div>
                </div>
              )}

              {/* PRIMARY ACTION BUTTON */}
              <div className="space-y-3">
                <button
                  id="generate-button"
                  onClick={handleGenerate}
                  disabled={isGenerating || !selectedImage}
                  className={`w-full py-4 border border-white transition-all duration-500 text-[11px] uppercase tracking-[0.4em] font-sans ${
                    isGenerating
                      ? "bg-neutral-900 border-neutral-800 text-neutral-500 cursor-not-allowed"
                      : !selectedImage
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-black text-white hover:bg-white hover:text-black"
                  }`}
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      RENDERING MASTER ({Math.round(generationProgress)}%)
                    </span>
                  ) : (
                    "RENDER MASTER"
                  )}
                </button>

                {!isGenerating && selectedImage && (
                  <button
                    id="simulate-button"
                    onClick={handleStartSimulation}
                    className="w-full py-3 border border-white/15 hover:border-white transition-all duration-300 text-[9px] uppercase tracking-[0.3em] font-sans bg-[#050505] text-neutral-400 hover:text-white"
                  >
                    Simular em Tempo Real (Instantâneo)
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div id="history-panel" className="lg:col-span-12 space-y-8 font-sans">
            <div className="flex justify-between items-end border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] tracking-[0.3em] uppercase opacity-40 block mb-1">Queue & Render History</span>
                <h3 className="text-lg tracking-wider uppercase text-white font-serif">
                  FILA DE PROCESSAMENTO
                </h3>
              </div>
              {history.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm("Tem certeza que deseja limpar todo o histórico local?")) {
                      localStorage.removeItem("cinematic_animator_history");
                      setHistory([]);
                    }
                  }}
                  className="text-[9px] tracking-widest uppercase border border-white/20 hover:border-white px-4 py-2 bg-black text-neutral-300 transition-all"
                >
                  Limpar Histórico
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="border border-white/5 p-16 text-center bg-black">
                <Film className="w-10 h-10 text-neutral-700 mx-auto stroke-1 mb-4" />
                <h4 className="text-[10px] tracking-widest uppercase text-neutral-400">Nenhum render concluído</h4>
                <p className="text-xs text-neutral-600 mt-2 max-w-sm mx-auto font-serif">
                  Retorne ao painel Processar e inicie o renderizador para registrar suas simulações Veo 3.1.
                </p>
                <button
                  onClick={() => setActiveTab("editor")}
                  className="mt-6 border border-white text-white bg-black hover:bg-white hover:text-black transition-all px-5 py-2.5 text-[9px] tracking-widest uppercase"
                >
                  Ir para o Estúdio
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {history.map((item) => (
                  <div key={item.id} className="bg-black border border-white/10 overflow-hidden p-5 flex flex-col md:flex-row gap-5">
                    <div className="w-full md:w-1/3 aspect-square bg-[#050505] overflow-hidden relative shrink-0 border border-white/5">
                      <img
                        src={item.image}
                        alt="Foto de Entrada"
                        className="w-full h-full object-cover grayscale"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-2 left-2 px-1.5 py-0.5 text-[8px] tracking-widest uppercase bg-black text-neutral-400 border border-white/10">
                        ORIGINAL
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] tracking-wider text-neutral-500 font-mono">{item.timestamp}</span>
                          <span className="px-2 py-0.5 text-[8px] tracking-widest bg-white/10 text-white border border-white/20">RENDERED</span>
                        </div>
                        <p className="text-xs text-neutral-300 font-serif leading-relaxed line-clamp-3">
                          {item.prompt}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="px-2 py-0.5 text-[9px] bg-white/5 border border-white/10 text-neutral-400 uppercase tracking-wider">{item.aspectRatio}</span>
                          <span className="px-2 py-0.5 text-[9px] bg-white/5 border border-white/10 text-neutral-400 uppercase tracking-wider">{item.resolution}</span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setSelectedImage(item.image);
                            setPrompt(item.prompt);
                            setAspectRatio(item.aspectRatio);
                            setResolution(item.resolution);
                            if (item.operationName === "SIMULADO") {
                              setIsSimulated(true);
                              setVideoUrl("");
                            } else {
                              setIsSimulated(false);
                              setVideoUrl(`/api/video-download?operationName=${encodeURIComponent(item.operationName)}`);
                            }
                            setVideoPlaying(true);
                            setActiveTab("editor");
                          }}
                          className="text-[9px] tracking-widest uppercase text-white hover:underline flex items-center gap-1 font-bold"
                        >
                          Carregar Workspace <ChevronRight className="w-3 h-3" />
                        </button>
                        
                        <a
                          href={item.operationName === "SIMULADO" ? item.image : `/api/video-download?operationName=${encodeURIComponent(item.operationName)}`}
                          download={item.operationName === "SIMULADO" ? `simulacao_snapshot_${item.id}.png` : `veo_video_${item.id}.mp4`}
                          className="p-2 border border-white/20 hover:border-white text-neutral-400 hover:text-white transition-colors bg-black"
                          title={item.operationName === "SIMULADO" ? "Baixar Snapshot" : "Baixar MP4"}
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "guide" && (
          <div id="guide-panel" className="lg:col-span-12 bg-black border border-white/10 p-8 space-y-8 font-sans">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase opacity-40 block mb-1">Curation & Aesthetics</span>
              <h3 className="text-lg tracking-wider uppercase text-white font-serif">
                GALERIA E DIRETRIZES DE ARTE
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="bg-[#050505] border border-white/5 p-6 space-y-4">
                <div className="w-8 h-8 border border-white/10 flex items-center justify-center text-neutral-400">
                  <Contrast className="w-4 h-4" />
                </div>
                <h4 className="text-[10px] tracking-widest uppercase text-white font-semibold">1. Composição Estática</h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-serif">
                  A fisionomia do composto monocromático é mantida estritamente intacta. A luz de alto contraste assegura que cada detalhe das rugas e do fluxo de água seja acentuado sem piscares ou distorções no rosto.
                </p>
              </div>

              <div className="bg-[#050505] border border-white/5 p-6 space-y-4">
                <div className="w-8 h-8 border border-white/10 flex items-center justify-center text-neutral-400">
                  <Sliders className="w-4 h-4" />
                </div>
                <h4 className="text-[10px] tracking-widest uppercase text-white font-semibold">2. Zoom Cinemático de 2%</h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-serif">
                  A escala de aproximação gradual de 2% durante os 8 segundos gera um efeito hipnotizante, mantendo o enquadramento equilibrado e focado no centro emocional da cena.
                </p>
              </div>

              <div className="bg-[#050505] border border-white/5 p-6 space-y-4">
                <div className="w-8 h-8 border border-white/10 flex items-center justify-center text-neutral-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-[10px] tracking-widest uppercase text-white font-semibold">3. Micropartículas e Névoa</h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-serif">
                  Pequenas bolhas e ondas de calor microscópicas se movem de forma coerente. Recomenda-se o uso de termos descritivos de fluxo sutil para reforçar o realismo do render.
                </p>
              </div>

            </div>

            <div className="border border-white/10 bg-white/5 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h4 className="text-[10px] tracking-widest uppercase text-white font-semibold">Testar composição de amostra agora</h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-xl font-serif">
                  O composto original de "mão submersa" em tons monocromáticos de luxo já está pronto no estúdio para renderização.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedImage(DEFAULT_MONOCHROME_HAND);
                  setPrompt(PRESETS[0].prompt);
                  setActiveTab("editor");
                }}
                className="px-6 py-3 border border-white bg-black text-white hover:bg-white hover:text-black text-[10px] tracking-widest uppercase transition-all"
              >
                Carregar no Estúdio
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer / Status Credits */}
      <footer className="border-t border-white/10 py-8 px-12 bg-black mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-[9px] tracking-[0.2em] uppercase opacity-40 font-sans">
          <div className="flex items-center space-x-3">
            <span>© 2026 CINÉMA VIF</span>
            <span className="opacity-30">•</span>
            <span>Photography Monograph Edition</span>
          </div>
          <div className="mt-3 md:mt-0 flex items-center space-x-6">
            <span>VEO ENGINE 3.1 ACTIVE</span>
            <span>LATENCY: FAST TRACK</span>
            <span>ID: {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
