"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatHeader } from "@/components/ChatHeader";
import { ListeningBanner } from "@/components/ListeningBanner";
import { SuggestionChip } from "@/components/SuggestionChip";
import { TypingIndicator } from "@/components/TypingIndicator";
import { VoiceInputButton } from "@/components/VoiceInputButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/lib/i18n";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isVoice?: boolean;
}

const SUGGESTION_TRANSLATIONS: Record<string, string[]> = {
  en: ["How do I register to vote?", "What happens on voting day?", "How are votes counted?", "What is VVPAT?", "How long does the election process take?", "What if I disagree with a result?"],
  hi: ["मैं मतदाता पंजीकरण कैसे करूं?", "मतदान दिवस पर क्या होता है?", "वोटों की गिनती कैसे होती है?", "VVPAT क्या है?", "चुनाव प्रक्रिया में कितना समय लगता है?", "अगर मैं परिणाम से असहमत हूं तो क्या करूं?"],
  mr: ["मतदार नोंदणी कशी करावी?", "मतदान दिवशी काय होते?", "मते कशी मोजली जातात?", "VVPAT म्हणजे काय?", "निवडणूक प्रक्रियेला किती वेळ लागतो?", "निकालाशी असहमत असल्यास काय करावे?"],
};

const GREETING = "Hello! I'm your CivicAI assistant. I can help you with voter registration, polling information, and understanding ballot measures. How can I assist your democratic journey today?";

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function AskPage() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING, timestamp: getTime() },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentLanguage = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  const suggestions = SUGGESTION_TRANSLATIONS[language] || SUGGESTION_TRANSLATIONS["en"];

  const handleVoiceTranscript = useCallback((text: string) => {
    setInput(text);
    setTimeout(() => { sendMessage(text, true); }, 500);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, followUps]);

  const sendMessage = useCallback(
    async (text: string, isVoice: boolean = false) => {
      if (!text.trim() || isLoading) return;
      setShowSuggestions(false);
      setFollowUps([]);
      const userMsg: Message = { role: "user", content: text.trim(), timestamp: getTime(), isVoice };
      const newMsgs = [...messages, userMsg];
      setMessages(newMsgs);
      setInput("");
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: newMsgs.map((m) => ({ role: m.role, content: m.content })), newMessage: text.trim(), language }),
        });
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "Could you try again?", timestamp: getTime() }]);
        if (Array.isArray(data.followUps) && data.followUps.length > 0) {
          setFollowUps(data.followUps);
        }
      } catch {
        setMessages((prev) => [...prev, { role: "assistant", content: "Connection issue. Please try again.", timestamp: getTime() }]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, language]
  );

  const handleSubmit = useCallback((e: React.FormEvent) => { e.preventDefault(); sendMessage(input); }, [input, sendMessage]);
  const lastAssistantIndex = messages.reduce((lastIdx, msg, idx) => (msg.role === "assistant" ? idx : lastIdx), -1);

  return (
    <main id="main-content" className="flex flex-col h-screen">
      <ChatHeader />

      {showSuggestions && (
        <div className="flex gap-2 px-5 py-3 overflow-x-auto flex-shrink-0 border-b border-border/50">
          {suggestions.slice(0, 3).map((t, i) => (
            <SuggestionChip key={t} text={t} onSelect={sendMessage} index={i} />
          ))}
        </div>
      )}

      <ScrollArea className="flex-1 px-5">
        <div className="py-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i}>
              <ChatBubble role={msg.role} content={msg.content} timestamp={msg.timestamp} index={i} isVoice={msg.isVoice} />
              {msg.role === "assistant" && i === lastAssistantIndex && !isLoading && followUps.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.3 }} className="flex flex-wrap gap-2 mt-2 ml-11">
                  {followUps.map((text, chipIdx) => (
                    <motion.div key={text} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.3 + chipIdx * 0.15 }}>
                      <SuggestionChip text={text} onSelect={sendMessage} index={chipIdx} size="sm" />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
          {isLoading && <TypingIndicator />}
          {showSuggestions && messages.length === 1 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {suggestions.slice(3).map((t, i) => (
                <SuggestionChip key={t} text={t} onSelect={sendMessage} index={i + 3} />
              ))}
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="flex-shrink-0 mb-16 border-t border-border bg-background">
        <ListeningBanner isListening={isListening} languageNativeName={currentLanguage.nativeName} />
        <form onSubmit={handleSubmit} className="flex items-center gap-2 px-5 py-4">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about candidates, registration..." className="flex-1 bg-card border-border focus-visible:ring-electric rounded-xl py-5" disabled={isLoading} aria-label="Chat message input" />
          <VoiceInputButton onTranscript={handleVoiceTranscript} onListeningChange={setIsListening} disabled={isLoading} />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="bg-electric hover:bg-electric/80 text-white rounded-xl h-10 w-10 flex-shrink-0" aria-label="Send message">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
      <BottomNav />
    </main>
  );
}
