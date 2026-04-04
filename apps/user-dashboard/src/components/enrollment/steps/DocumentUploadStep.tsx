"use client";

import React, { useState } from "react";
import { Translate } from "@/components/ui/translate";
import { Button } from "@/components/ui/button";
import { FileText, Upload, CheckCircle2, ArrowRight, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DocumentUploadStepProps {
  onNext: (file: any) => void;
  onBack: () => void;
  title: string;
  description: string;
  label: string;
}

export function DocumentUploadStep({ onNext, onBack, title, description, label }: DocumentUploadStepProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      onNext(file);
    }, 2000);
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto relative group">
           <FileText className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
           <div className="absolute inset-x-[-20%] inset-y-[-20%] bg-primary/5 blur-[40px] rounded-full -z-10 group-hover:bg-primary/10 transition-colors" />
        </div>
        <h2 className="text-3xl font-manrope font-black text-white tracking-tight uppercase">
          <Translate text={title} /> <br />
          <span className="text-white/40 font-bold italic normal-case text-lg tracking-normal">
             <Translate text={description} />
          </span>
        </h2>
      </div>

      <div className="space-y-8">
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div 
              key="upload-zone"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="relative"
            >
              <input 
                type="file" 
                id="doc-upload" 
                className="hidden" 
                accept="image/*,.pdf" 
                onChange={handleFileChange} 
              />
              <label 
                htmlFor="doc-upload"
                className="flex flex-col items-center justify-center p-12 bg-white/5 border-2 border-dashed border-white/10 rounded-[40px] hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group/upload"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover/upload:bg-primary/20 transition-all">
                  <Upload className="w-10 h-10 text-white/20 group-hover/upload:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-manrope font-black text-white tracking-tight uppercase">
                  <Translate text={label} />
                </h3>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-3">
                   <Translate text="PNG, JPG or PDF up to 5MB" />
                </p>
              </label>
            </motion.div>
          ) : (
            <motion.div 
              key="preview-zone"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="p-8 bg-surface-card border border-primary/50 relative overflow-hidden rounded-[40px] shadow-[0_0_30px_rgba(16,185,129,0.1)]"
            >
               <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
               <button onClick={() => { setFile(null); setPreview(null); }} className="absolute top-4 right-4 p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500/20 transition-colors">
                  <X className="w-5 h-5" />
               </button>
               
               <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                     {preview ? <img src={preview} className="w-full h-full object-cover rounded-2xl" /> : <CheckCircle2 className="w-10 h-10 text-primary" />}
                  </div>
                  <div className="flex-1 overflow-hidden">
                     <h4 className="text-xl font-manrope font-black text-white tracking-tight uppercase truncate">{file.name}</h4>
                     <p className="text-xs font-bold text-white/30 uppercase tracking-widest mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB · <Translate text="Ready to scan" />
                     </p>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 pt-6">
          <Button 
            onClick={onBack}
            variant="ghost"
            disabled={uploading}
            className="h-16 px-8 hover:bg-white/5 text-white/40 hover:text-white transition-all rounded-[32px] font-black text-xs uppercase tracking-widest border border-white/5"
          >
             <Translate text="Back" />
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex-1 h-16 bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 active:scale-95 transition-all font-black text-lg rounded-[32px] flex items-center justify-center gap-3 border-none shadow-[0_0_40px_-5px_rgba(249,115,22,0.4)] disabled:opacity-20 disabled:grayscale transition-all"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Translate text="Extract & Upload" />
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>
      
      <p className="text-center text-[10px] font-black uppercase text-white/20 tracking-[0.4em] pt-4 italic">
        Automatic OCR extraction using AWS Textract Core
      </p>
    </div>
  );
}
