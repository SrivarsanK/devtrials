"use client";

import React, { useState, useRef, useEffect } from "react";
import { Translate } from "@/components/ui/translate";
import { Button } from "@/components/ui/button";
import { Camera, Upload, RefreshCw, CheckCircle2, ArrowRight, Loader2, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CaptureStepProps {
  onComplete: (image: string) => void;
  onBack: () => void;
}

export function CaptureStep({ onComplete, onBack }: CaptureStepProps) {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<'selection' | 'camera' | 'upload' | 'preview'>('selection');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => stopCamera();
  }, []);

  // START CAMERA
  const startCamera = async () => {
    try {
      setCameraError(null);
      setView('camera');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 1024 }, height: { ideal: 1024 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setCameraError("Camera access denied. Please check site permissions.");
      setView('selection');
    }
  };

  // STOP CAMERA
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // CAPTURE FROM VIDEO
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage(dataUrl);
        stopCamera();
        setView('preview');
      }
    }
  };

  // HANDLE FILE UPLOAD
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setView('preview');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = () => {
    if (!image) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onComplete(image);
    }, 2000);
  };

  const reset = () => {
    stopCamera();
    setImage(null);
    setView('selection');
  };

  if (!mounted) {
    return (
      <div className="w-full max-w-lg mx-auto py-20 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary/20" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto relative group overflow-hidden border border-primary/20 shadow-[0_0_30px_-10px_rgba(255,70,37,0.3)]">
           <Camera className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(255,70,37,0.6)]" />
           <div className="absolute inset-x-[-20%] inset-y-[-20%] bg-primary/2 blur-[20px] rounded-full -z-10 group-hover:bg-primary/5 transition-colors" />
        </div>
        <h2 className="text-3xl font-display font-black text-white tracking-tight uppercase">
          <Translate text="Premium Verification" /> <br />
          <span className="text-muted-foreground/80 font-bold italic normal-case text-lg tracking-normal">
             <Translate text="Face Verification Enrollment" />
          </span>
        </h2>
      </div>

      <div className="space-y-8 min-h-[360px] flex flex-col justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          
          {/* SELECTION VIEW */}
          {(view === 'selection' || view === 'upload') && (
            <motion.div 
              key="selection"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
               <button 
                onClick={startCamera}
                className="p-10 glass-subtle border border-white/5 rounded-[48px] flex flex-col items-center gap-6 group hover:border-primary/50 hover:bg-primary/5 transition-all duration-500 shadow-xl"
               >
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform ring-4 ring-primary/5">
                     <Camera className="w-10 h-10 text-primary" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight"><Translate text="Live Capture" /></h3>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest"><Translate text="Use System Camera" /></p>
                  </div>
               </button>

               <button 
                onClick={() => { setView('upload'); fileInputRef.current?.click(); }}
                className={`p-10 glass-subtle border border-white/5 rounded-[48px] flex flex-col items-center gap-6 group hover:border-white/20 hover:bg-white/10 transition-all duration-500 shadow-xl ${view === 'upload' ? 'ring-2 ring-primary border-primary' : ''}`}
               >
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform ring-4 ring-white/5">
                     <Upload className="w-10 h-10 text-muted-foreground/80" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight"><Translate text="Upload Photo" /></h3>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest"><Translate text="From Device Storage" /></p>
                  </div>
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
               </button>

               {cameraError && (
                 <div className="col-span-full flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-semibold uppercase tracking-widest">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <Translate text={cameraError} />
                 </div>
               )}
            </motion.div>
          )}

          {/* CAMERA VIEW */}
          {view === 'camera' && (
            <motion.div 
              key="camera"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative flex flex-col items-center gap-8"
            >
              <div className="w-full aspect-square bg-black border-2 border-primary rounded-[64px] relative overflow-hidden shadow-[0_0_50px_-10px_rgba(16,185,129,0.3)]">
                 <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale-[30%]" />
                 
                 {/* Biometric Scanning Beam */}
                 <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary/20 rounded-full border-dashed animate-pulse" />
                 </div>

                 <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex justify-center">
                    <button 
                      onClick={capturePhoto}
                      className="w-20 h-20 rounded-full bg-white flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                    >
                       <div className="w-16 h-16 rounded-full border-4 border-black" />
                    </button>
                 </div>
                 <button 
                   onClick={reset}
                   className="absolute top-6 right-6 p-3 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors backdrop-blur-md"
                 >
                    <X className="w-6 h-6" />
                 </button>
              </div>
              <p className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-[0.4em] animate-pulse">
                <Translate text="Position your face in the center of the frame" />
              </p>
              <canvas ref={canvasRef} className="hidden" />
            </motion.div>
          )}

          {/* PREVIEW VIEW */}
          {view === 'preview' && (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative flex flex-col items-center"
            >
               <div className="w-full aspect-square bg-[#0e0e0e] border border-primary rounded-[64px] relative overflow-hidden shadow-[0_0_60px_-10px_rgba(16,185,129,0.5)]">
                  {image && <img src={image} className="w-full h-full object-cover" />}
                  <div className="absolute inset-0 border-[24px] border-[#0e0e0e]/90 rounded-[64px]" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                       <CheckCircle2 className="w-24 h-24 text-primary drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]" />
                    </motion.div>
                  </div>
               </div>
               
               <button 
                onClick={reset}
                className="mt-8 flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-full transition-all text-muted-foreground/80 hover:text-white border border-white/5"
               >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest"><Translate text="Retake or Change" /></span>
               </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 pt-6">
          <Button 
            onClick={onBack}
            variant="ghost"
            disabled={loading}
            className="h-16 px-8 hover:bg-white/5 text-muted-foreground/80 hover:text-white transition-all rounded-[32px] font-black text-xs uppercase tracking-widest border border-white/10"
          >
             <Translate text="Back" />
          </Button>
          <Button 
            onClick={handleFinish}
            disabled={!image || loading || view === 'camera'}
            className="flex-1 h-16 bg-primary hover:bg-primary/90 text-white transition-all font-black text-lg rounded-[32px] flex items-center justify-center gap-3 border-none shadow-[0_0_40px_-5px_rgba(255,70,37,0.5)] disabled:opacity-20 disabled:grayscale transition-all"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Translate text="Confirm Identity" />
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>
      
      <p className="text-center text-[10px] font-black uppercase text-muted-foreground/60 tracking-[0.4em] pt-4 italic">
        <Translate text="Face recognition active — AI verification in progress" />
      </p>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
