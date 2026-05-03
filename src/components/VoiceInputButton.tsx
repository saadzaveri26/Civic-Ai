"use client";

import { useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition } from "@/lib/hooks/useSpeechRecognition";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  onListeningChange?: (isListening: boolean) => void;
  disabled?: boolean;
}

export function VoiceInputButton({ onTranscript, onListeningChange, disabled }: VoiceInputButtonProps) {
  const {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  useEffect(() => {
    if (onListeningChange) {
      onListeningChange(isListening);
    }
  }, [isListening, onListeningChange]);

  useEffect(() => {
    if (transcript && transcript.trim() !== "") {
      onTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, onTranscript, resetTranscript]);

  if (!isSupported) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission if placed inside a form
    if (disabled && !isListening) return;

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  let icon = <Mic className="w-5 h-5 text-slate-300" />;
  let tooltip = "Click to speak";

  if (isListening) {
    icon = <MicOff className="w-5 h-5 text-red-500" />;
    tooltip = "Listening... click to stop";
  } else if (error) {
    icon = <Mic className="w-5 h-5 text-amber-500" />;
    tooltip = error;
  }

  return (
    <div className="relative inline-flex items-center justify-center" title={tooltip}>
      {isListening && (
        <motion.div
          className="absolute inset-0 bg-red-500/20 rounded-full"
          animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleClick}
        disabled={disabled && !isListening}
        aria-label={isListening ? "Stop listening" : "Start voice input"}
        className="relative z-10 hover:bg-secondary rounded-full"
      >
        {icon}
      </Button>
    </div>
  );
}
